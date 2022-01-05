const {
  groupCollapsed,
  assert
} = require("console");
const easyvk = require("easyvk");
const {
  cpuUsage
} = require("process");
const readline = require('readline');
const login = require("./login");
const constants = require("./constants");
const utils = require("./utils");
const {
  WhereEnum
} = require("./constants");
const {
  graph
} = require("./constants");
const {
  simpleEvents
} = require("./constants");
const {
  sleep
} = require("./utils");
const {
  difEvents
} = require("./constants")

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

//WhereEnum = constants.WhereEnum;
//graph = constants.graph;

const TROFY_TO_GO_HOME = 200
const FIGHT_SEQ = []

var currentState = WhereEnum.Town;

//var Last3 = []
//var Last3Text = []
//var last;
//var lastText;

var last = []
var lastText = [];


async function main(vk) {

  console.log(vk.session) |
    await go(vk, WhereEnum.Well)

  while (true) {
    await Explore(vk);
    console.log("og eya")
    await rest(vk);
    console.log("oh yeah")
    await rest(vk);
    await dealTrophy(vk);
  }


  //await utils.getNewLast3(vk,Last3);
  //await getNewLast(vk,last);
  //console.log(lastText)
  //await goto(vk, WhereEnum.Well)
  // console.log(currentState)
  // while (currentState ==  WhereEnum.Well){
  //   if (stateAtWell == 0)
  //     await startExplore(vk);
  //}
}


async function Explore(vk) {


  var id = await send(vk, "Исследовать уровень")

  while (checkMes(["исследования:"]) === false) {
    console.log("Жду надпись скорость исследования")
    await getMesFromId(vk, id);
  }

  var sped = checkMes(["исследования:"])
  var re = /\d+(?=\%)/
  sped = re.exec(lastText[sped])
  sped = 3333 * (1 + (parseFloat(sped) / 100))
  console.log("sped", sped)



  while (!await getMesFromId(vk, id, sped)) {
    console.log("jdem исследование");
  }

  if (checkMes(["тут есть что-то"]) !== false) {
    var id = await send(vk, "Обыскать")
    while (!await getMesFromId(vk, id))
      console.log("wait");
  }
  console.log(lastText[0])
  console.log(lastText[0].includes("id"))
  if (lastText[0].includes("id")) {
    while (!await getMesFromId(vk, id, sped)) {
      console.log("jdem исследование дальше");
    }
  }

  console.log("start checking new event")
  await checkNewEvent(vk)
  console.log("Stop exploration function")
  if (checkMes(["Вы обнаруживаете"]) !== false) {
    var id = await send(vk, "Собрать")
    while (!await getMesFromId(vk, id))
      console.log("wait");
  }
  if (checkMes(["Покоится рядом"])!== false) {
    var id = await send(vk, "Освежевать")
    while (!await getMesFromId(vk, id))
      console.log("wait");
  }
}


async function checkNewEvent(vk) {
  await sleep(3000);
  if (checkMesInWell(Object.keys(simpleEvents)) != false) {
    console.log("simpleEvent")
    await startSimple(vk, checkMesInWell(Object.keys(simpleEvents)))
  } else
  if (checkMesInWell(Object.keys(difEvents)) != false) {
    await startDif(vk, checkMesInWell(Object.keys(difEvents)))
  }
  console.log("Stop event function")
}

async function startDif(vk, eve) {

  console.log(eve)
  var i = difEvents[eve];

  switch (i) {

    case 1:
      await fight(vk);
      break;
    case 2:
      await chest(vk);
      break;
    case 3:
      await fishing(vk);
      break;
    case 4:
      await pvp(vk);
      break;
    case 5:
      await hunt(vk);
      break;
    case 6:
      await trap(vk);
      break;
    case 7:
      await labirint(vk);
      break;
    case 8:
      await ruins(vk);
      break;
    case 9:
      await job(vk);
      break;
    default:
      console.log("Ya slomalsa");
      break;
  }

}

async function fight(vk) {
  console.log("fight")



}

async function getButtons(vk){
  
}


async function chest(vk) {
  console.log("chest")

  var id = await send(vk, "Открыть")

  while (!await getMesFromId(vk, id, 2000))
    console.log("waiting answer")

  if (checkMes(["открывается"])) {
    console.log("Normal chest")
    while (checkMes(["Местность", "Локация"]) === false)
      await getMesFromId(vk, id, 2000);
    await sleep(2000);
    await getMesFromId(vk, id, 2000);
    return;
  } else{
    console.log("mimik")
    while (checkMes(["Тип"]) === false)
      await getMesFromId(vk, id, 2000);
    await fight(vk);
  }

}

async function fishing(vk) {
  console.log("fishing")

  while (true){

    var id = send(vk, "Закинуть удочку")
    while(checkMes(["полностью ушёл под воду"]) === false){
      console.log("waiting"); 
      await getMesFromId(vk,id)
    }

    id = await send(vk, "Подсечь")
    while(!await getMesFromId(vk,id)){
      console.log("fesh")
    }

    if (checkMes["вытягивается очень тяжело"] !== false){
      await fight(vk);
      break; 
    }else
    if (checkMes["рыбалка завершилась"] !== false){
      console.log("sad but true");
      while (checkMes(["Местность", "Локация"]) === false)
        await getMesFromId(vk, id, 2000);
      await sleep(2000);
      await getMesFromId(vk, id, 2000);      
      return; 
    }else
    {

      while(checkMes(["осталось:"]) === false)
        await getMesFromId(vk,id); 
      var re = /(?:осталось\: )(\d*)/mg
      var baits = re.exec(lastText[checkMes(["осталось:"])])[1];
      console.log(baits)
      if (baits == 0){
        id = await send("Прервать рыбалку");

        while (!await getMesFromId(vk,id))
          console.log(wait);
        
        id = await send("Прервать")
        while (checkMes(["Местность", "Локация"]) === false)
          await getMesFromId(vk, id, 2000);
        await sleep(2000);
        await getMesFromId(vk, id, 2000);
        return;        

      }
    }

    


  }

}

async function pvp(vk) {
  console.log("pvp")
}

async function hunt(vk) {
  console.log("hunt")

  var id = await send(vk,".")
  while (checkMes(["больше не осталось"])===false){
    await getMesFromId(vk,id)
  }
  id = await send(vk, "Прервать охоту")
  while (checkMes(["Местность", "Локация"]) === false)
    await getMesFromId(vk, id, 2000);
  await sleep(2000);
  await getMesFromId(vk, id, 2000);
  await go(vk, 124)
  var id = await send(vk, "Обычные трофеи");
  while (!await getMesFromId(vk, id))
    console.log("wait");
  id = await send(vk, "Охотничьи трофеи");
  while (!await getMesFromId(vk, id))
    console.log("wait");
  await go(vk, WhereEnum.Well)
  return;
}

async function trap(vk) {
  console.log("trap")
  var id = await send(vk, "Освободиться"); 
  while (checkMes(["Местность", "Локация"]) === false)
    await getMesFromId(vk, id, 2000);
  await sleep(2000);
  await getMesFromId(vk, id, 2000);
  return;  
}

async function labirint(vk) {
  console.log("labirint")
  await send(vk, "Покинуть лабиринт")
  var id = await send(vk, "Покинуть лабиринт")
  while (checkMes(["Местность", "Локация"]) === false)
  await getMesFromId(vk, id, 2000);
  await sleep(2000);
  await getMesFromId(vk, id, 2000);
  return;  
}

async function ruins(vk) {
  console.log("ruins")
  var id = await send(vk, "харашо")

  while (checkMes(["больше не осталось добычи"])===false)
    await getMesFromId(vk, id, 10000);
  
    id = await send(vk,"Прервать поиск");
    while (checkMes(["Местность", "Локация"]) === false)
      await getMesFromId(vk, id, 2000);
    await sleep(2000);
    await getMesFromId(vk, id, 2000);
    return;    
}

async function job(vk) {
  console.log("job")
  var id = send(vk,"Харашо");
  
  while (checkMes(["увеличилась на"]) ===false)
    await getMesFromId(vk, id, 10000);
  
  id = await send(vk,"Покинуть");


  while (checkMes(["Местность", "Локация"]) === false)
    await getMesFromId(vk, id, 2000);
  await sleep(2000);
  await getMesFromId(vk, id, 2000);
  return;  
}



async function startSimple(vk, eve) {

  var path = simpleEvents[eve]
  console.log(path)
  var id = 0
  for (var i of path) {
    console.log(i)
    id = await send(vk, i);
    console.log(id)
    while (!await getMesFromId(vk, id))
      console.log("wait");
  }
  console.log("End of the path")
  console.log(checkMes(["Местность", "Локация"]))
  while (checkMes(["Местность", "Локация"]) === false)
    await getMesFromId(vk, id, 2000);
  console.log("Умер тута?")

  await sleep(2000);
  await getMesFromId(vk, id, 2000);
  console.log("Death")
}



async function dealTrophy(vk) {
  var i = checkMes(["Местность", "Локация"])
  var re = /(?:Трофеев: )(\d*)/gm
  var troph = re.exec(lastText[i])[1]
  console.log(troph)
  if (troph >= TROFY_TO_GO_HOME) {
    await go(vk, 124)
    var id = await send(vk, "Обычные трофеи");
    while (!await getMesFromId(vk, id))
      console.log("wait");
    id = await send(vk, "Охотничьи трофеи");
    while (!await getMesFromId(vk, id))
      console.log("wait");
    await go(vk, WhereEnum.Well)
  }
}

async function rest(vk) {
  console.log("Start rest")
  var i = checkMes(["Местность", "Локация"])
  console.log(lastText[i])
  var re = /\d+(?=\%)/;
  var hp = re.exec(lastText[i])[0]
  console.log(hp)
  if (hp < 50) {
    console.log("rest")
    var id = await send(vk, "Отдых")
    console.log(id)
    console.log("After send message")

    while (checkMes(["Местность", "Локация"]) === false) {
      console.log("waiting rest")
      await getMesFromId(vk, id, 9000)

      if (checkMes(["был прерван"])) {
        while (checkMes(["Тип:"]) == fasle)
          await getMesFromId(vk, id, 2000);
        id = await send(vk, "Сбежать")
        while (!await getMesFromId(vk, id))
          console.log("wait");
        id = await send(vk, "Подтвердить")
        while (checkMes(["Местность:"]) === fasle) {
          console.log("Waiting end after fight")
          await getMesFromId(vk, id, 5000);
        }
      }
    }
    console.log("End of the rest")
  } else console.log("No rest need");
}

async function getMesFromId(vk, id, wait = 2000) {
  console.log("boo")
  let vkr = await vk.call('messages.getHistory', {
    offset: '-20',
    user_id: '-182985865',
    start_message_id: id,
  });
  //console.log(vkr.items)
  var Last = [];
  var LastText = [];
  vkr.items.forEach(element => Last.push(element.id))
  vkr.items.forEach(element => LastText.push(element.text))
  console.log(LastText)
  var len = last.length
  console.log(len, Last.length)
  last = Last
  lastText = LastText
  await sleep(wait)
  if (last.length - len > 0)
    return true;
  else return false;
}

function checkMesInWell(messages) {
  for (var item of messages) {
    for (var i = 0; i < lastText.length; i += 1) {
      if (lastText[i].includes(item))
        return item
    }
  }
  return false;
}

function checkMes(messages) {
  for (var item of messages) {
    for (var i = 0; i < lastText.length; i += 1) {
      if (lastText[i].includes(item))
        return i
    }
  }
  return false;
}

async function go(vk, Where) {
  var path = utils.perebor(currentState, Where)
  console.log(path)
  j = 0
  for (var i of path) {
    j += 1
    console.log(i)
    var id = await send(vk, i);
    if (i == "Портовый квартал" || i == "Верхний квартал" || i == "Вернуться" || (j == path.length && Where % 10 != 0) || i == "Назад") {
      console.log("л")
      console.log(last.length)
      while (!await getMesFromId(vk, id))
        console.log("wait");

    } else {
      console.log("boo")
      while (checkMes(["Совет", "к точке"]) == false) {
        await getMesFromId(vk, id);
      }

      console.log("bobo")
      console.log(checkMes(["Совет", "к точке"]), lastText)
      while (checkMes(["Совет", "к точке"]) == lastText.length)
        await getMesFromId(vk, id, 5000);
    }
  }
  console.log("Death")
  currentState = Where;
}


async function send(vk, mes) {
  var randomid = easyvk.randomId()
  var a = await vk.call('messages.send', {
    user_id: '-182985865',
    message: mes,
    random_id: randomid
  })
  let vkr = await vk.call('messages.getHistory', {
    offset: '0',
    user_id: '-182985865',
    count: 1
  });
  //console.log(vkr.items[0].id, vkr.items[0].text)
  last = []
  lastText = []
  await sleep(2000);
  return vkr.items[0].id;
}


// async function getLast(vk, prev) {
//   let vkr = await vk.call('messages.getHistory', {
//     offset: '0',
//     count: '1',
//     user_id: '-182985865'//,
//     //start_message_id: '-1'
//   });
//   let Last;
//   let LastText;
//   vkr.items.forEach(element => Last = element.id)
//   vkr.items.forEach(element => LastText = element.text)
//   return [Last, LastText];
// }

// async function getNewLast(vk,prev)
// {
//   var nw = await getLast(vk,prev)
//   while (nw[0] == prev){
//     await utils.sleep(1000);
//     console.log("wait")
//     nw = await getLast(vk,prev)
//   }
//   last = nw[0]
//   lastText = nw[1]
// }

// async function getNewLastMSC(vk,prev, wait)
// {
//   var nw = await getLast(vk,prev)
//   while (nw[0] == prev){
//     await utils.sleep(wait);
//     console.log("wait")
//     nw = await getLast(vk,prev)
//   }
//   last = nw[0]
//   lastText = nw[1]
// }


// async function goto(vk, Where) {
//   var path = utils.perebor(currentState, Where)
//   console.log(path)
//   var j = 0
//   for (var i of path) {
//     j +=1;
//     console.log(i)
//     await utils.sleep(2000);
//     await utils.send(vk, i);
//     await getNewLast(vk, last);
//     if (j < path.length){
//     while (lastText.includes("Подождите") || lastText.includes("к точке") || lastText.includes(i) || lastText.includes("подождите") || lastText.includes("Советы")){
//       await getNewLast(vk, last);
//       console.log(lastText, "newnew")
//     }
//   }


//   }
//   console.log('Death')
//   await getNewLast(vk, last);
//   await utils.sleep(2000);
//   console.log("Way is done")
//   currentState = Where;
// }


async function logInWith2Auth(params) {
  return new Promise((_2faNeed) => {

    function relogIn(_2faCode = "") {

      if (_2faCode) params.code = _2faCode

      easyvk(params).then(main).catch((err) => {

        if (!err.easyvk_error) {
          if (err.error_code == "need_validation") {
            _2faNeed({
              err: err,
              relogIn: relogIn
            });
          }

        }

      })
    }

    relogIn()

  })
}
logInWith2Auth({
  username: login.LOGIN,
  password: login.ASSWORD,
  reauth: false,
}).then(({
  err: error,
  relogIn
}) => {

  console.log(error.validation_type);

  rl.question(error.error + " ", (answer) => {

    let code = answer;
    relogIn(code);

    rl.close();

  });

})
