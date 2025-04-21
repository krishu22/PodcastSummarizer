import shutil
from tempfile import NamedTemporaryFile
from fastapi import UploadFile

async def save_upload_file(upload_file: UploadFile) -> str:
    suffix = "." + upload_file.filename.split(".")[-1]
    with NamedTemporaryFile(delete=False, suffix=suffix) as temp_file:
        shutil.copyfileobj(upload_file.file, temp_file)
        return temp_file.name