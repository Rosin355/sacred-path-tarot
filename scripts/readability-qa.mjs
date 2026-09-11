// Run against a local Vite server configured with synthetic Supabase values only.
import { createRequire } from 'node:module';
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base = 'http://127.0.0.1:5173';
const out = process.env.QA_OUTPUT || '/private/tmp/trevie-readability';
await mkdir(out, { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH, headless: true });
const report = [];
try {
  for (const [width, height] of [[1440,900], [768,1024], [390,844], [720,450]]) {
    const page = await browser.newPage({ viewport: { width, height } });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    // Never allow this test to contact a live database, auth or edge function.
    await page.route(/https?:\/\/[^/]+\/(rest|auth|functions)\/v1\//, route => route.fulfill({json: []}));
    await page.goto(base);
    await page.waitForFunction(() => !document.body.classList.contains('cinematic-loading') && document.querySelector('h1'));
    await page.waitForTimeout(1000);
    const isStatic = await page.evaluate(() => document.body.classList.contains('cinematic-static'));
    await page.screenshot({path: `${out}/home-${width}.png`});
    if (!isStatic) {
      for (let fraction = 0; fraction <= 1.001; fraction += .025) {
        await page.evaluate(f => window.scrollTo(0, (document.documentElement.scrollHeight-innerHeight)*f), fraction);
        await page.waitForTimeout(60);
        const visible = await page.locator('.moment').evaluateAll(nodes => nodes.filter(n => !n.inert && n.getBoundingClientRect().bottom>0 && n.getBoundingClientRect().top<innerHeight).map(n => ({opacity: getComputedStyle(n).opacity, filter:getComputedStyle(n).filter})));
        assert(visible.every(n => Number(n.opacity)===0 || Number(n.opacity)===1), 'Partially transparent text');
        assert(visible.every(n => n.filter==='none'), 'Blurred text');
        assert(visible.filter(n => Number(n.opacity)===1).length<=1, 'Overlapping text blocks');
      }
      await page.screenshot({path: `${out}/finale-${width}.png`});
    }
    await page.emulateMedia({reducedMotion:'reduce'});
    await page.reload();
    await page.waitForFunction(() => document.body.classList.contains('cinematic-static'));
    assert(await page.locator('.moment').evaluateAll(nodes => nodes.every(n => !n.inert && getComputedStyle(n).opacity==='1')));
    assert(await page.locator('.pin').evaluateAll(nodes => nodes.every(n => getComputedStyle(n).position!=='sticky')));
    for (const route of ['/arcani','/respiro','/ispirazione','/privacy','/login','/admin']) {
      await page.goto(base+route);
      await page.waitForTimeout(900);
      assert(await page.locator('h1').count()>0, `Missing heading ${route}`);
      assert(await page.evaluate(() => document.documentElement.scrollWidth<=innerWidth+1), `Horizontal overflow ${route} ${width}`);
      if (['/arcani','/respiro','/ispirazione'].includes(route)) {
        await page.screenshot({path:`${out}/${route.slice(1)}-${width}.png`});
        await page.locator('#richiesta').scrollIntoViewIfNeeded();
        await page.screenshot({path:`${out}/form-${route.slice(1)}-${width}.png`});
      }
    }
    report.push({width,height,homeMode:isStatic?'static-fit':'cinematic',errors});
    assert.equal(errors.length,0,errors.join('\n'));
    await page.close();
  }
  const page = await browser.newPage({ reducedMotion:'reduce' });
  let sends = 0; let payload; let fail = true;
  await page.route(/https?:\/\/[^/]+\/(rest|auth|functions)\/v1\//, async route => {
    if (route.request().url().endsWith('/rpc/submit_contact_inquiry')) {
      assert(route.request().url().startsWith('http://127.0.0.1:54321/'), 'Refusing live submission');
      sends++; payload=route.request().postDataJSON();
      await new Promise(resolve=>setTimeout(resolve,250));
      await route.fulfill(fail ? {status:503,json:{message:'synthetic failure'}} : {json:'00000000-0000-4000-8000-000000000001'});
    } else await route.fulfill({json:[]});
  });
  for (const via of ['arcani','respiro','ispirazione']) {
    sends=0; fail=true;
    await page.goto(base+'/'+via);
    const form=page.locator('#richiesta');
    await form.getByRole('button',{name:'Invia la richiesta'}).click();
    await page.waitForTimeout(100);
    assert.equal(sends,0);
    await page.locator(`#${via}-name`).fill('Test sintetico');
    await page.locator(`#${via}-email`).fill('QA@EXAMPLE.TEST');
    await page.locator(`#${via}-topic`).selectOption('altro');
    await page.locator(`#${via}-message`).fill('Messaggio sintetico per la verifica locale del modulo.');
    await page.locator(`#${via}-privacy`).click();
    await form.getByRole('button',{name:'Invia la richiesta'}).click();
    await page.waitForTimeout(500);
    assert.equal(sends,1);
    const token=payload.p_submission_token;
    assert.equal(payload.p_email,'qa@example.test');
    assert.equal(payload.p_via,via);
    assert((await page.locator(`#${via}-message`).inputValue()).length>20);
    fail=false;
    await form.getByRole('button',{name:'Invia la richiesta'}).click();
    await page.waitForTimeout(500);
    assert.equal(payload.p_submission_token,token);
    await form.getByText('La tua richiesta è stata accolta. Ti risponderemo con cura.').waitFor();
    report.push({via,form:'validation, normalization, error preservation, idempotent retry, success: PASS (mock RPC)'});
  }
  console.log(JSON.stringify(report,null,2));
} finally { await browser.close(); }
