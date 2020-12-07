FROM python:3.8-alpine
COPY ./requirements.txt /app/
RUN pip install -r requirements.txt
COPY ./print.py /app/
CMD ["python3", "print.py"]
