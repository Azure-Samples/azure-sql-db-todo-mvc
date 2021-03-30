package io.nub3s;

import io.quarkus.mongodb.panache.MongoEntity;
import io.quarkus.mongodb.panache.PanacheMongoEntity;
// import org.bson.codecs.pojo.annotations.BsonProperty;

import java.time.LocalDate;
// import java.util.List;

import javax.json.bind.annotation.JsonbProperty;

@MongoEntity(collection="configurations")
public class Configuration extends PanacheMongoEntity {
    
    @JsonbProperty("configuration-id")
    public String configId;

    @JsonbProperty("display-name")
    public String displayName;

    @JsonbProperty("icon-image-uri")
    public String iconImageUri;

    @JsonbProperty("theme-identifier")
    public String themeIdentifier;

    @JsonbProperty("smaller-is-better")
    public String isSmallerBetter;

    @JsonbProperty("creation-date")
    public LocalDate creationDate;

    @JsonbProperty("autoreset")
    public boolean autoReset = false;

    @JsonbProperty("autoreset-date")
    public LocalDate autoResetDate;
}