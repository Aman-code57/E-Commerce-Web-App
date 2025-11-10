import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from core.config import settings


def send_email(to_email: str, subject: str, body: str, is_html: bool = False):
    msg = MIMEMultipart()
    msg['From'] = settings.mail_from
    msg['To'] = to_email
    msg['Subject'] = subject

    mime_type = 'html' if is_html else 'plain'
    msg.attach(MIMEText(body, mime_type))

    try:
        server = smtplib.SMTP(settings.mail_server, settings.mail_port)
        server.starttls()
        server.login(settings.mail_username, settings.mail_password)
        text = msg.as_string()
        server.sendmail(settings.mail_from, to_email, text)
        server.quit()
        return True
    except Exception as e:
        print(f"Failed to send email: {e}")
        return False
