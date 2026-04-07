const client = new Ably.Realtime("JW3Hvw.fw1o0A:-zV3VatQkBUx-hVmtwFGE6Bwbv_wG4kIoz7LHOKNawY");
export const channel = client.channels.get("game");

export function sendState(state){
  channel.publish("state", state);
}

export function receiveState(callback){
  channel.subscribe("state", msg => {
    callback(msg.data);
  });
}