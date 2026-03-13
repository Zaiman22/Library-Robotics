from fastapi.staticfiles import StaticFiles

app.mount("/image", StaticFiles(directory="server_data/img"), name="image")