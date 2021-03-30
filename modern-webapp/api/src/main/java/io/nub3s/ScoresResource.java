package io.nub3s;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import io.vertx.axle.core.eventbus.EventBus;

import javax.inject.Inject;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.HeaderParam;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Response;

import org.eclipse.microprofile.config.inject.ConfigProperty;

import java.util.List;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

@Path("/scores")
public class ScoresResource {

    @ConfigProperty(name = "quickauthenforcing", defaultValue = "true")
    protected boolean quickAuthEnforcing;
    @ConfigProperty(name = "quickauthuser", defaultValue = "true")
    protected String quickAuthUser;
    @ConfigProperty(name = "quickauthpassword", defaultValue = "true")
    protected String quickAuthPassword;
    @ConfigProperty(name = "checksumenforcing", defaultValue = "true")
    protected boolean checksumEnforcing;
    @ConfigProperty(name = "checksumsecret", defaultValue = "123456")
    protected String checksumSecret;

    @Inject EventBus bus;

    @GET
    @Produces("application/json")
    public List<Score> list(){
        return Score.listAllDescending();
    }

    @POST
    @Consumes("application/json")
    public Response create(@HeaderParam("Authorization") String authorization, Score score) {
        if (quickAuthEnforcing) {
            if (authorization == null) return Response.status(401).build();
            if (!authorization.toLowerCase().startsWith("basic")) return Response.status(401).build();
            String base64string = authorization.substring("Basic".length()).trim();
            byte[] bytes = Base64.getDecoder().decode(base64string);
            String credentials = new String(bytes, StandardCharsets.UTF_8);
            final String[] keyValueCredentials = credentials.split(":", 2);
            if (keyValueCredentials[0].compareTo(quickAuthUser)!=0) return Response.status(401).build();
            if (keyValueCredentials[1].compareTo(quickAuthPassword)!=0) return Response.status(401).build();
        }
        else {
            System.out.println("POST to /score: ignoring basic auth");
        }
        if (checksumEnforcing) {
            // System.out.println("POST to /score: checksum="+score.checksum);
            if (score.checksum == null || score.checksum.length()<=0) return Response.status(401).build();
            if (!validateChecksum(score.name, score.score.toString(), score.checksum)) return Response.status(401).build();
        }
        else {
            System.out.println("POST to /score: ignoring checksums");
        }
        score.persist();
        bus.publish("newscore", score.toString()); // tell NotifcationsWebSocket to broadcast an update
        bus.publish("topten", topTenList().toString()); // tell NotifcationsWebSocket to broadcast an update
        return Response.status(201).build();
    }

    @GET
    @Path("/count")
    @Produces("text/plain")
    public Long count(){
        return Score.count();
    }

    @GET
    @Path("/topten")
    @Produces("application/json")
    public List<Score> topTenList(){
        return Score.findTopTen();
    }

    private boolean validateChecksum(String userName, String userScore, String checksum) {
        // System.out.println("user / score: " + userName + " / " + userScore);
        // System.out.println("validating checksum using secret:" + checksumSecret);
        String mashup = userName + userScore + checksumSecret;
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-1");
            byte[] digest = md.digest(mashup.getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder(40);
            for (int i = 0; i < digest.length; ++i) {
                sb.append(Integer.toHexString((digest[i] & 0xFF) | 0x100).substring(1, 3));
            }
            System.out.println("calculated checksum to be: " + sb.toString());
            System.out.println("     provided checksum is: " + checksum);
            return (sb.toString().equals(checksum));
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException(e);
        }
    }
}