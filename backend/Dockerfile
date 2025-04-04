# Dockerfile for Spring Boot backend
FROM eclipse-temurin:17-jdk
WORKDIR /app
COPY . .
RUN ./mvnw package -DskipTests
CMD ["java", "-jar", "target/backend-0.0.1-SNAPSHOT.jar"]
EXPOSE 8080
