import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import { siteContent } from "@/lib/site-content";
import { emailColors } from "@/components/emails/email-theme";

export type ContactNotificationEmailProps = {
  fullName: string;
  email: string;
  phone: string;
  message: string;
};

export function ContactNotificationEmail({
  fullName,
  email,
  phone,
  message,
}: ContactNotificationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>{`New contact message from ${fullName}`}</Preview>
      <Body style={body}>
        <Container style={container}>
          <Section style={hero}>
            <Text style={eyebrow}>Terra Lodge</Text>
            <Heading style={titleStyles}>New Contact Message</Heading>
            <Text style={introStyles}>
              Someone reached out through the website contact form and left the
              details below.
            </Text>
            <Section style={heroMeta}>
              <Text style={heroMetaLabel}>Sender</Text>
              <Text style={heroMetaValue}>{fullName}</Text>
            </Section>
          </Section>

          <Section style={card}>
            <Section style={stack}>
              <Text style={sectionEyebrow}>Sender Details</Text>
              <Text style={line}>
                <strong>Name:</strong> {fullName}
              </Text>
              <Text style={line}>
                <strong>Email:</strong> {email}
              </Text>
              <Text style={line}>
                <strong>Phone:</strong> {phone || "Not provided"}
              </Text>

              <Hr style={divider} />

              <Text style={sectionEyebrow}>Message</Text>
              <Text style={messageBox}>{message}</Text>
            </Section>
          </Section>

          <Section style={footer}>
            <Text style={footerText}>
              Reply to the sender directly or follow up from {siteContent.contact.email}.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const body = {
  margin: 0,
  backgroundColor: emailColors.background,
  fontFamily:
    'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
};

const container = {
  maxWidth: "640px",
  margin: "0 auto",
  padding: "32px 20px 40px",
};

const hero = {
  padding: "0 0 20px",
};

const eyebrow = {
  margin: "0 0 10px",
  color: emailColors.accent,
  fontSize: "11px",
  fontWeight: 700,
  letterSpacing: "0.24em",
  textTransform: "uppercase" as const,
};

const titleStyles = {
  margin: "0 0 12px",
  color: emailColors.text,
  fontSize: "32px",
  lineHeight: "1.08",
};

const introStyles = {
  margin: 0,
  color: emailColors.muted,
  fontSize: "15px",
  lineHeight: "1.7",
};

const card = {
  border: `1px solid ${emailColors.border}`,
  borderRadius: "0",
  backgroundColor: emailColors.card,
  padding: "0",
};

const stack = {
  padding: "24px",
};

const sectionEyebrow = {
  margin: "0 0 8px",
  color: emailColors.accent,
  fontSize: "11px",
  fontWeight: 700,
  letterSpacing: "0.22em",
  textTransform: "uppercase" as const,
};

const heroMeta = {
  marginTop: "18px",
  border: `1px solid ${emailColors.border}`,
  borderRadius: "0",
  backgroundColor: emailColors.card,
  padding: "16px 18px",
};

const heroMetaLabel = {
  margin: 0,
  color: emailColors.accent,
  fontSize: "10px",
  fontWeight: 700,
  letterSpacing: "0.2em",
  textTransform: "uppercase" as const,
};

const heroMetaValue = {
  margin: "6px 0 0",
  color: emailColors.text,
  fontSize: "18px",
  fontWeight: 700,
};

const divider = {
  borderColor: emailColors.border,
  margin: "22px 0",
};

const line = {
  margin: "0 0 10px",
  color: emailColors.text,
  fontSize: "15px",
  lineHeight: "1.7",
};

const messageBox = {
  margin: 0,
  whiteSpace: "pre-wrap" as const,
  color: emailColors.text,
  fontSize: "15px",
  lineHeight: "1.75",
  padding: "16px",
  borderRadius: "0",
  backgroundColor: emailColors.accentSoft,
  border: `1px solid ${emailColors.border}`,
};

const footer = {
  padding: "18px 4px 0",
};

const footerText = {
  margin: 0,
  color: emailColors.muted,
  fontSize: "13px",
  lineHeight: "1.7",
};
