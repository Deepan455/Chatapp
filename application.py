import os
import requests,time

from flask import Flask, jsonify, render_template, request, session
from flask_session import Session
from flask_socketio import SocketIO, emit

app=Flask(__name__)
app.config["SECRET_KEY"]='os.getenv("SECRET_KEY")'
app.config["SESSION_PERMANENT"]=False
app.config["SESSION_TYPE"]="filesystem"
socketio=SocketIO(app)
Session(app)

channels=set()
channels.add("Family")
channels.add("Friends")
messages={"Family":[],"Friends":[]}
log={"use":None,"chh":None}

@app.route("/")
def main():
    return render_template("main.html",channels=channels,log=log)

@socketio.on("name submit")
def submit(data):
    chan=data["name"]
    log["use"]=chan
    emit("display channel",{"chan":chan},broadcast=True)

@socketio.on("message submit")
def text(data):
    global messages
    channeln=data["channel"]

    #Limit the messages to 100
    if len(messages[channeln]) >= 99:
        messages[channeln].pop(0)

    message=data["message"]
    user=data["user"]
    tyam=time.ctime(time.time())
    #arr=message+'\n'+user+'\n'+tyam
    arr=[message,user,tyam]
    messages[channeln].append(arr)
    togive=messages[channeln]
    emit("display message",{"myassage":togive,"channeln":channeln},broadcast=True)

@socketio.on("channel change")
def chch(data):
    select=data["channel"]
    togive=messages[select]
    emit("display message",{"myssage":togive,"channel":select})

@app.route("/sochannel",methods=["POST"])
def sochannel():
    here=log["chh"]
    tosend=messages[here]
    return jsonify({"message":tosend})

@app.route("/channel/<chname>")
def channels1(chname):
    log["chh"]=chname
    mess=messages[chname]
    return render_template("main.html",channels=channels,mess=mess,log=log);

@app.route("/create")
def create():
    return render_template("channel.html",log=log)

@app.route("/channels",methods=["post"])
def chans():
    global channels;
    try:
        name=request.form.get('channel')
        if name not in channels:
            channels.add(name)
            messages[name]=[]
        return render_template("main.html",channels=channels,log=log)
    except:
        return render_template("channel.html",log=log,message="Unknown error occured")

if __name__=="__main__":
    socketio.run(app,debug = True)
