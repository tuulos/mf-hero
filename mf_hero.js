
var ANIM_CODE = {};
var ANIM_CONSOLE = {};
var ANIM_NOTEBOOK = {};

function hideAll(){
    for (const key of Object.keys(ANIM_CODE)){
        try{ ANIM_CODE[key].reset(); }catch{}
        try{ ANIM_CONSOLE[key].reset(); }catch{}
        try{ ANIM_NOTEBOOK[key].reset(); }catch{}
    };
    const codes = document.getElementsByTagName('code');
    for (const code of codes)
        code.style.display = 'none';

    const sections = document.getElementsByClassName('section');
    for (const sect of sections)
        sect.classList.remove('active');

    const nbrows = document.getElementsByClassName('nb-row');
    for (const nbrow of nbrows)
        nbrow.style.display = 'none';

    document.getElementById("console").innerHTML = "#";
    document.getElementById("nb-prompt-in").innerHTML = "In []:";
}

function setActive(id){
    const el = document.getElementById(id);
    el.classList.remove('active');
    el.classList.add('done');
}

function animConsole(index, lines){
    let type = new TypeIt("#console",
        {
            speed: 200,
            lifeLike: true,
            startDelay: 100,
            afterComplete: function(){
                const nb = ANIM_NOTEBOOK["a" + index];
                ANIM_CONSOLE["a" + index].destroy();
                if (nb)
                    nb.go();
                else
                    setActive("a" + index);
            }
        })
        .type(" ")
        .pause(500)
        .type("python ")
        .options({speed: 30})
        .type("myflow.py run")
        .break()
        .options({speed: 0, lifeLike: false})
        .pause(200)
        .type("<span class='mf_title'><b>Metaflow 2.1.0</b> executing MyFlow</span>")
        .break()
        .pause(600);
    lines.forEach(function(line){
        const pathspec = (index + 1) + "/" + line.step + "/" + (line.taskid ? line.taskid: 1);
        type.type("<span class='mf_tstamp'>[" + pathspec + "]</span> " + line.msg);
        type.break();
    });
    type.pause(200);
    type.type("<span class='mf_done'>Flow successful ✨</span>");
    return type;
}

function animCodeInit(index){
    var type = new TypeIt("#c" + index,
        {
            speed: 0.0,
            lifeLike: false,
            startDelay: 0,
            afterComplete: function(){
                ANIM_CODE["a" + index].destroy();
                let console = ANIM_CONSOLE["a" + index];
                if (console)
                    console.go();
            }
        })
        .move('START')
        .options({speed: 30, lifeLike: true});
    return type;
}

function animNotebookInit(index){
    var type = new TypeIt("#ni" + index,
        {
            speed: 50,
            lifeLike: true,
            startDelay: 1000,
            afterComplete: function(){
                document.getElementById("nb-prompt-in").innerHTML = "In [1]:";
                document.getElementById("nb-prompt-out").innerHTML = "Out [1]:";
                document.getElementById("nb-row-out").style.display = 'block';
                document.getElementById("no" + index).style.display = 'block';
                setActive("a" + index);
            },
            beforeStep: function(){
                document.getElementById("ni" + index).style.display = 'block';
                document.getElementById("nb-row-in").style.display = 'block';
            }
        })
        .pause(100)
        .exec(function(){
            ANIM_NOTEBOOK["a" + index].destroy();
            document.getElementById("nb-prompt-in").innerHTML = "In [*]:";
        })
        .pause(1000);
    return type;
}

function clickSection(index){
    hideAll();
    console.log("index", index)
    const code = document.getElementById("c" + index);
    code.style.display = 'block';
    const sect = document.getElementById("a" + index);
    sect.classList.add('active');
    ANIM_CODE["a" + index].go();
}

window.onload = function(){

    hljs.highlightAll();

    ANIM_CONSOLE = {
        a0: animConsole(0, [
                {step: 'start', msg: "hello"},
                {step: 'end', msg: "world"}
            ]),
        a1: animConsole(1, [
                {step: 'start', msg: ""},
                {step: 'end', msg: "fruits ['apple', 'orange', 'kiwi']"}
            ])
    }

    ANIM_CODE['a0'] = animCodeInit(0)
        .move(43, {instant: true})
        .type('<span class="hljs-title class_ inherited__">FlowSpec</span>')
        .move(3)
        .break()
        .type('\t<span class="hljs-meta">@step</span>')
        .options({speed: 5, lifeLike: false})
        .move(36)
        .options({speed: 30, lifeLike: true})
        .type('\t\tself.next(self.end)')
        .break()
        .break()
        .type('\t<span class="hljs-meta">@step</span>');

    ANIM_CODE['a1'] = animCodeInit(1)
        .move(96, {instant: true})   
        .delete(14)
        .type("self.fruits = [<span class='hljs-string'>'apple'</span>, <span class='hljs-string'>'orange'</span>]")
        .move(46)
        .break()
        .type("\t\tself.fruits.append(<span class='hljs-string'>'kiwi'</span>)")
        .move(16)
        .delete(7)
        .type("<span class='hljs-string'>'fruits'</span>, self.fruits");



    ANIM_NOTEBOOK['a1'] = animNotebookInit(1);


    const sections = document.getElementsByClassName('section');
    for (let i = 0; i < sections.length; i++)
        sections[i].addEventListener('click', fn => clickSection(i));

    hideAll();
    /*
    setTimeout(function(){
        const el = document.getElementById("pill_create_workflows");
        click_create_workflows(el);
    }, 100);
    */

}