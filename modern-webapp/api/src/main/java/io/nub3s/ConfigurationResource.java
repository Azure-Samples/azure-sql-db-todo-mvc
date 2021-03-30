package io.nub3s;

import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Response;
import java.util.List;

@Path("/configuration")
public class ConfigurationResource {
    @GET
    @Produces("application/json")
    public List<Configuration> list(){
        return Configuration.listAll();
    }

    @GET
    @Path("/{id}")
    @Produces("application/json")
    public Configuration get(@PathParam("id") String id){
        return Configuration.findById(id);
    }
    
    @POST
    @Consumes("application/json")
    public Response create(Configuration configuration){
        configuration.persist();
        return Response.status(201).build();
    }

    @PUT
    @Path("/{id}")
    @Consumes("application/json")
    public void update(@PathParam("id") String id, Configuration configuration){
        configuration.update();
    }

    @DELETE
    @Path("/{id}")
    public void delete(@PathParam("id") String id){
        Configuration configuration = Configuration.findById(id);
        configuration.delete();
    }

    @GET
    @Path("/count")
    @Produces("text/plain")
    public Long count(){
        return Configuration.count();
    }
}