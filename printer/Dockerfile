FROM python:3.8-alpine
COPY ./requirements.txt /app/
RUN pip install -r /app/requirements.txt
COPY ./print.py /app/
WORKDIR /app
CMD ["python3", "print.py"]
