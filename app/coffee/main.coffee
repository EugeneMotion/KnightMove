# arr 8 ways of Knight
moveX = [1, 2, 2, 1, -1, -2, -2, -1]
moveY = [-2, -1, 1, 2, 2, 1, -1, -2]
showLines = true
posDef = [Math.floor(Math.random() * 8) + 1, Math.floor(Math.random() * 8) + 1] # def pos
# create board cells arr
cellOk = []
for x in [-1..10]
    cellOk[x] = []
# move to one of 8 ways
arrMove = (arr, n) -> [arr[0] + moveX[n-1], arr[1] + moveY[n-1]]
# convert arr to cell id
arrToStr = (arr) -> "#cell-#{arr[0]}#{arr[1]}"
# test move
okMove = (arr, n) -> cellOk[arr[0] + moveX[n-1]][arr[1] + moveY[n-1]]
# calc steps count
calcNStep = (arr) ->
    pN = 0
    for i in [1..8]
        pN++ if okMove(arr, i)
    pN
# convert arr to svg coord
arrToCoord = (arr) -> "#{1000/8*(arr[0]-0.5)},#{1000/8*(arr[1]-0.5)}"
##################  
# main calc func #
calc = (posKnight) ->    
    posStart = posKnight # start pos
    # clear board
    for x in [-1..10]
        for y in [-1..10]
            cellOk[x][y] = ((x > 0) and (x < 9) and (y > 0) and (y < 9))
    # start init
    m = 0 # move number
    kWay = [] # moves history
    goodMove = true
    $("g g text").html("") # clear move number
    $("g g text").removeClass("dark") # clear dark nums
    $("g g use").addClass("hidden") # clear horses    
    $(".svg-line").html("") # remove line
    $(arrToStr(posStart) + " use").removeClass("hidden") # add first horse    
    if showLines
        pathMove = "M" + arrToCoord(posStart) # first coord of line
    else 
        $(arrToStr(posStart) + " text").html("0") # add first num
        $(arrToStr(posStart) + " text").addClass("dark") # dark first num         
    $(".info-pos").html("- start " + posStart)
    console.log("start from " + posStart)
    cellOk[posStart[0]][posStart[1]] = false # mark pos
    # get tick
    tStart = performance.now();
    while goodMove   
        nStep = 9
        resI = 0
        for i in [1..8] # iterate ways
            if okMove(posKnight, i) # if move possible
                tempNStep = calcNStep(arrMove(posKnight, i)) # calc steps count
                if tempNStep < nStep # find min
                    nStep = tempNStep
                    resI = i
        goodMove = resI > 0
        if goodMove
            posKnight = arrMove(posKnight, resI) # change Knight pos
            cellOk[posKnight[0]][posKnight[1]] = false # mark cell
            kWay[++m] = resI # inc move and save way
    # get calc time
    tEnd = performance.now();
    # out info
    $(".info-iter").html("- moves " + m)
    console.log("- moves " + m)
    console.log("- calc time " + Math.round(tEnd - tStart) + " ms")
    # out numbers to cells
    posOut = posStart
    for i in [1..m]
        posOut = arrMove(posOut, kWay[i]) # remember move
        if showLines            
            pathMove += "L" + arrToCoord(posOut) # add line coord
        else
            $(arrToStr(posOut) + " text").html(i) # out move number      
    if showLines
        $(".svg-line").html("<path d=\"" + pathMove + "\"/>") # add line
    else        
        $(arrToStr(posOut) + " text").addClass("dark") # dark last num
    $(arrToStr(posOut) + " use").removeClass("hidden") # add last horse
    # get full calc time
    tEnd = performance.now();
    calcTime = " time " + Math.round(tEnd - tStart) + " ms"
    console.log("- calc and out" + calcTime)     
    $(".info-time").html("-" + calcTime)
    console.log("end")

# out calc res on load
calc(posDef) 

# new calc from click
$("g g").click ->
    clickId = $(this).attr("id")
    posDef = [+clickId[clickId.length - 2],+clickId[clickId.length - 1]]
    console.log("+ click")
    calc(posDef)
    
# switch num/lines
elem_lines = document.querySelector(".js-switch-lines")
init_lines = new Switchery(elem_lines, { color: "#D24D57", size: "small"})
elem_lines.onchange = () ->
    console.log("- switch")
    showLines = elem_lines.checked
    calc(posDef)