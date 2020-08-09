/*document.addEventListener('click',()=>{
  document.querySelector('hr').style.animationPlayState='running';
  document.querySelector('hr').style.animationPlayState='paused';
});*/

document.addEventListener('DOMContentLoaded',()=>{
  if (!localStorage.getItem('user'))
  {
    localStorage.setItem('user','');
  }
  const name1=localStorage.getItem('user');

  //To disable the submit button when nothing is typed
  document.querySelector('#submit').disabled=true;
  document.querySelector('#takein').onkeydown=()=>{
    if(document.querySelector('#takein').value.length > 0){
      document.querySelector('#submit').disabled=false;
      document.querySelector('#takein').onkeyup=(event)=>{
        if (event.keyCode == 13){
          document.querySelector("#submit").click();
        }
      };
    }
    else{
      document.querySelector('#submit').disabled=true;
    }
};

  //To make sure the input field is not empty
  document.querySelector('#button').disabled=true;
  document.querySelector('#name').onkeyup=()=>{
    document.querySelector('#button').disabled=false;
  };

  //Ask for display name when not available
  if(name1=='')
  {
    document.querySelector('#button').onclick=()=>{
      const name=document.querySelector('#name').value;
      if (name=='')
      {
        document.querySelector('#warn').innerHTML='Please type a display name to continue';
      }
      else
      {
        localStorage.setItem('user',name);
        document.querySelector('#form').style.display='none';
        document.querySelector('#nameholder').innerHTML=name;
      }
    };
  }
  else{
    var thisuser=localStorage.getItem('user');
    p=document.querySelector('#active_channel').innerHTML;
    localStorage.setItem('channel',p);
    if (localStorage.getItem('channel'))
    {
      var thischannel=localStorage.getItem('channel');
      bringmessage(thischannel);
    }

    document.querySelector('#nameholder').innerHTML=localStorage.getItem('user');
    document.querySelector('#form').style.display='none';
  }

  //To log out for changing the display name
  document.querySelector('#logout').onclick=()=>{
    localStorage.removeItem('user');
    window.location.reload();
  };
});

//Use of Web Sockets
document.addEventListener('DOMContentLoaded', () => {

    // Connect to websocket
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

    // When connected, configure buttons
    socket.on('connect', () => {
      document.querySelector('#submit').onclick=()=>{
      let input=document.querySelector('#takein').value;
      document.querySelector('#takein').value="";
      document.querySelector('#submit').disabled=true;
      let user=localStorage.getItem('user');
      let channel=localStorage.getItem('channel');
      socket.emit('message submit',{'message':input,'user':user,'channel':channel});
    };

        /*var channels=data.channels;
        var len=channels.length;
        var i=0;
        for(i=0;i<=len;i++)
        {
          document.write('test');
          cont=document.createElement('div');
          cont.innerHTML=channels[i];
          document.querySelector('#chtest').appendChild(cont);
        }*/
    });
    //To display the sent message
    socket.on('display message',data=>{
      let messagedata=data.myassage;
      let change=data.channeln;
      if(change==localStorage.getItem('channel'))
      {
        let k=messagedata.length;
        display=document.createElement("div");
        let workon=messagedata[k-1];
        let athing=Handlebars.compile("<div><div class=\"say\">{{say}}</div><div class=\"info\">{{person}}</div><div class=\"info\">{{time}}</div><div>");
        let say=workon[0];
        let person=workon[1];
        let time=workon[2];
        let thething=athing({'say':say,'person':person,'time':time});
        display.innerHTML=thething;
        let logger=document.querySelector('#nameholder').innerHTML;
        if (logger==person){
          display.childNodes[0].style.marginLeft='auto';
          display.childNodes[0].style.borderTopLeftRadius='10px';
          display.childNodes[0].style.borderTopRightRadius='20px';
          display.childNodes[0].style.borderBottomLeftRadius='20px';
          display.childNodes[0].style.borderBottomRightRadius='1px';
          display.childNodes[0].childNodes[1].style.justifyContent='flex-end';
          display.childNodes[0].childNodes[1].style.justifyContent='flex-end';
          display.childNodes[0].childNodes[2].style.justifyContent='flex-end';
        }

        document.querySelector('#scroll').appendChild(display);

        let scrollit=document.querySelector('#scroll');
        let a=scrollit.scrollTop;
        let b=scrollit.scrollHeight;
        scrollit.scrollTop=b;
      }
    });

    socket.on('display channel',data=>{

    });
});

function bringmessage(thischannel){
  const request= new XMLHttpRequest();
  request.open('post','/sochannel');

  request.onload=()=>{
    const data=JSON.parse(request.responseText);
    let now=data.message;
    printmessage(now);
    let scrollit=document.querySelector('#scroll');
    let a=scrollit.scrollTop;
    let b=scrollit.scrollHeight;
    scrollit.scrollTop=b;
  }

  request.send(thischannel);
  return false;
}

function printmessage(data)
{
  var income=data;
  let k=income.length;

  let i=0;
  for(i=0;i<k;i++){
    let display=document.createElement("div");
    let workon=income[i];
    let athing=Handlebars.compile("<div><div class=\"say\">{{say}}</div><div class=\"info\">{{person}}</div><div class=\"info\">{{time}}</div><div>");
    let say=workon[0];
    let person=workon[1];
    let time=workon[2];
    let thething=athing({'say':say,'person':person,'time':time});
    display.innerHTML=thething;
    display.innerHTML=thething;
    let logger=document.querySelector('#nameholder').innerHTML;
    if (logger==person){
      display.childNodes[0].style.marginLeft='auto';
      display.childNodes[0].style.borderTopLeftRadius='10px';
      display.childNodes[0].style.borderTopRightRadius='20px';
      display.childNodes[0].style.borderBottomLeftRadius='20px';
      display.childNodes[0].style.borderBottomRightRadius='1px';
      display.childNodes[0].childNodes[0].style.justifyContent='flex-end';
      display.childNodes[0].childNodes[1].style.justifyContent='flex-end';
      display.childNodes[0].childNodes[2].style.justifyContent='flex-end';
    }
    document.querySelector('#scroll').appendChild(display);
  }
//  document.querySelector('#test').innerHTML=one;
};
