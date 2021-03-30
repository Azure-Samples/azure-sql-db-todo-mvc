package io.nub3s;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import io.quarkus.vertx.ConsumeEvent;

import javax.enterprise.context.ApplicationScoped;
import javax.websocket.OnClose;
import javax.websocket.OnError;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.server.PathParam;
import javax.websocket.server.ServerEndpoint;
import javax.websocket.Session;

@ServerEndpoint("/notifications/{clientId}")         
@ApplicationScoped
public class NotificationsWebSocket {

    Map<String, Session> sessions = new ConcurrentHashMap<>(); 

    @OnOpen
    public void onOpen(Session session, @PathParam("clientId") String clientId) {
        sessions.put(clientId, session);
        broadcast("_socket_debug:Client c_" + clientId + " joined");
    }

    @OnClose
    public void onClose(Session session, @PathParam("clientId") String clientId) {
        sessions.remove(clientId);
        broadcast("_socket_debug:Client c_" + clientId + " left");
    }

    @OnError
    public void onError(Session session, @PathParam("clientId") String clientId, Throwable throwable) {
        sessions.remove(clientId);
        broadcast("_socket_debug:Client c_" + clientId + " left on error: " + throwable);
    }

    @OnMessage
    public void onMessage(String message, @PathParam("clientId") String clientId) {
        broadcast("c_"+clientId + ":" + message); // broadcast client messages too
    }

    private void broadcast(String message) {
        sessions.values().forEach(s -> {
            s.getAsyncRemote().sendObject(message, result ->  {
                if (result.getException() != null) {
                    System.out.println("Unable to send message: " + result.getException());
                }
            });
        });
    }

    @ConsumeEvent("newscore")               
    public void consumeScoreUpdate(String data) {
        broadcast("newscore:" + data);
        System.out.println("newscore:" + data);
    }

    @ConsumeEvent("topten")               
    public void pushOutTopTen(String data) {
        broadcast("topten:" + data);
        System.out.println("topten:" + data);
    }
}