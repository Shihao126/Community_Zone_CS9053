Backend deploy
1. Package with Maven
   
   mvn clean package
2. Create MySql table
   
   create database java_final;
   
   Other sql for creating tables is in the /resources/create_table.sql
3. Run the Spring Boot jar file
   
   java -jar /root/java_final/community_zone-0.0.1-SNAPSHOT.jar > /log/logfile.log 2>&1 &
