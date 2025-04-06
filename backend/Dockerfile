# Használjuk az Eclipse Temurin JDK 17-es képet (ez Java 17-hez van)
FROM eclipse-temurin:17-jdk

# Alkalmazás munkakönyvtára a konténeren belül
WORKDIR /app

# Másoljuk át az összes fájlt a konténerbe
COPY . .

# Fordítsuk le a projektet, tesztek nélkül
RUN chmod +x mvnw && ./mvnw clean package -DskipTests


# Futtassuk az elkészült JAR fájlt
CMD ["java", "-jar", "target/backend-0.0.1-SNAPSHOT.jar"]
