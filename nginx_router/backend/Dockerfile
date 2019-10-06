# FOR NORMAL WSGI CONTAINER
# WSGI server runs on Port 5005

# base python image
FROM python:3.6.9

# set working directory
WORKDIR '/app'

# OK b/c backend image contains no frontend code
COPY ./ ./
RUN pip install -r requirements.txt

EXPOSE 5005
CMD ["bash", "boot_prod.sh"]
