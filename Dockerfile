FROM eclipse-temurin:21-jdk

WORKDIR /app

COPY . .

EXPOSE 8080

CMD ["sh", "-c", "java -jar target/*.jar --server.port=${PORT:-8080}"]
