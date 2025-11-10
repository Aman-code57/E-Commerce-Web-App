from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str = "mysql+pymysql://root:Rockstar%405057@127.0.0.1:3306/e_commerce"
    secret_key: str = "your-secret-key-here"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30

    # Email settings
    mail_username: str = "amanraturi5757@gmail.com"
    mail_password: str = "epif azzt hgjg zvcy"
    mail_from: str = "amanraturi5757@gmail.com"
    mail_port: int = 587
    mail_server: str = "smtp.gmail.com"
    mail_starttls: bool = True
    mail_ssl_tls: bool = False

    class Config:
        env_file = ".env"


settings = Settings()
