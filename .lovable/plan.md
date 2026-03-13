

## Email Strategy Setup

Currently the project has **no email infrastructure configured** — no edge functions, no Resend integration, no auth email templates.

### Plan

#### 1. Set up Lovable Email for Auth emails
- Configure a sender domain via the email setup dialog
- After domain is ready, scaffold auth email templates (`scaffold_auth_email_templates`)
- Brand the templates to match the app's dark mystical theme (gold accents, serif fonts, Italian copy)
- Deploy the `auth-email-hook` edge function

#### 2. Set up Lovable Email for Transactional emails
- Scaffold transactional email template(s) for the contact/consultation form confirmations
- Deploy the `send-transactional-email` edge function

#### 3. Keep Resend reserved for future newsletter/marketing
- No Resend setup needed now since there's no newsletter feature yet
- When a newsletter feature is built later, we'll integrate Resend with its API key at that point

### First step
We need to set up the email sender domain first — everything else depends on it.

