from storages.backends.azure_storage import AzureStorage
from django.conf import settings
from django.core.files.storage import DefaultStorage


class AzureMediaStorage(AzureStorage):
    account_name = settings.AZURE_ACCOUNT_NAME
    account_key = settings.AZURE_ACCOUNT_KEY
    azure_container = settings.AZURE_MEDIA_CONTAINER_NAME
    expiration_secs = settings.AZURE_URL_EXPIRATION_SECS


def get_storage(private=False):
    if not settings.DEBUG:
        storage = AzureMediaStorage()
        if not private:
            storage.expiration_secs = None
        return AzureMediaStorage()
    else:
        return DefaultStorage()