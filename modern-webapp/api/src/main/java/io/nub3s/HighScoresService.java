package io.nub3s;

import javax.ws.rs.core.Response;
import javax.ws.rs.ext.Provider;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.ext.ExceptionMapper;
import javax.json.Json;
import javax.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class HighScoresService {

    @Provider
    public static class ErrorMapper implements ExceptionMapper<Exception> {
        @Override
        public Response toResponse(Exception exception) {
            int code = 500; // default
            if (exception instanceof WebApplicationException) {
                code = ((WebApplicationException) exception).getResponse().getStatus();
            }
            return Response.status(code)
                    .entity(Json.createObjectBuilder().add("Sorry, something went wrong", exception.getMessage()).add("code", code).build())
                    .build();
        }
    }
}