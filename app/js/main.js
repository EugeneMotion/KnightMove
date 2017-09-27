var arrMove, arrToCoord, arrToStr, calc, calcNStep, cellOk, elem_lines, init_lines, j, moveX, moveY, okMove, posDef, showLines, x;

moveX = [1, 2, 2, 1, -1, -2, -2, -1];

moveY = [-2, -1, 1, 2, 2, 1, -1, -2];

showLines = true;

posDef = [Math.floor(Math.random() * 8) + 1, Math.floor(Math.random() * 8) + 1];

cellOk = [];

for (x = j = -1; j <= 10; x = ++j) {
  cellOk[x] = [];
}

arrMove = function(arr, n) {
  return [arr[0] + moveX[n - 1], arr[1] + moveY[n - 1]];
};

arrToStr = function(arr) {
  return "#cell-" + arr[0] + arr[1];
};

okMove = function(arr, n) {
  return cellOk[arr[0] + moveX[n - 1]][arr[1] + moveY[n - 1]];
};

calcNStep = function(arr) {
  var i, k, pN;
  pN = 0;
  for (i = k = 1; k <= 8; i = ++k) {
    if (okMove(arr, i)) {
      pN++;
    }
  }
  return pN;
};

arrToCoord = function(arr) {
  return (1000 / 8 * (arr[0] - 0.5)) + "," + (1000 / 8 * (arr[1] - 0.5));
};

calc = function(posKnight) {
  var calcTime, goodMove, i, k, kWay, l, m, nStep, o, p, pathMove, posOut, posStart, ref, resI, tEnd, tStart, tempNStep, y;
  posStart = posKnight;
  for (x = k = -1; k <= 10; x = ++k) {
    for (y = l = -1; l <= 10; y = ++l) {
      cellOk[x][y] = (x > 0) && (x < 9) && (y > 0) && (y < 9);
    }
  }
  m = 0;
  kWay = [];
  goodMove = true;
  $("g g text").html("");
  $("g g text").removeClass("dark");
  $("g g use").addClass("hidden");
  $(".svg-line").html("");
  $(arrToStr(posStart) + " use").removeClass("hidden");
  if (showLines) {
    pathMove = "M" + arrToCoord(posStart);
  } else {
    $(arrToStr(posStart) + " text").html("0");
    $(arrToStr(posStart) + " text").addClass("dark");
  }
  $(".info-pos").html("- start " + posStart);
  console.log("start from " + posStart);
  cellOk[posStart[0]][posStart[1]] = false;
  tStart = performance.now();
  while (goodMove) {
    nStep = 9;
    resI = 0;
    for (i = o = 1; o <= 8; i = ++o) {
      if (okMove(posKnight, i)) {
        tempNStep = calcNStep(arrMove(posKnight, i));
        if (tempNStep < nStep) {
          nStep = tempNStep;
          resI = i;
        }
      }
    }
    goodMove = resI > 0;
    if (goodMove) {
      posKnight = arrMove(posKnight, resI);
      cellOk[posKnight[0]][posKnight[1]] = false;
      kWay[++m] = resI;
    }
  }
  tEnd = performance.now();
  $(".info-iter").html("- moves " + m);
  console.log("- moves " + m);
  console.log("- calc time " + Math.round(tEnd - tStart) + " ms");
  posOut = posStart;
  for (i = p = 1, ref = m; 1 <= ref ? p <= ref : p >= ref; i = 1 <= ref ? ++p : --p) {
    posOut = arrMove(posOut, kWay[i]);
    if (showLines) {
      pathMove += "L" + arrToCoord(posOut);
    } else {
      $(arrToStr(posOut) + " text").html(i);
    }
  }
  if (showLines) {
    $(".svg-line").html("<path d=\"" + pathMove + "\"/>");
  } else {
    $(arrToStr(posOut) + " text").addClass("dark");
  }
  $(arrToStr(posOut) + " use").removeClass("hidden");
  tEnd = performance.now();
  calcTime = " time " + Math.round(tEnd - tStart) + " ms";
  console.log("- calc and out" + calcTime);
  $(".info-time").html("-" + calcTime);
  return console.log("end");
};

calc(posDef);

$("g g").click(function() {
  var clickId;
  clickId = $(this).attr("id");
  posDef = [+clickId[clickId.length - 2], +clickId[clickId.length - 1]];
  console.log("+ click");
  return calc(posDef);
});

elem_lines = document.querySelector(".js-switch-lines");

init_lines = new Switchery(elem_lines, {
  color: "#D24D57",
  size: "small"
});

elem_lines.onchange = function() {
  console.log("- switch");
  showLines = elem_lines.checked;
  return calc(posDef);
};
