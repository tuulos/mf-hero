
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

    const nb_outs = document.getElementsByClassName('nb-out');
    for (const nb_out of nb_outs)
        nb_out.style.display = 'none';

    const sections = document.getElementsByClassName('section');
    for (const sect of sections){
        sect.classList.remove('active');
        sect.classList.remove('done');
    }

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

function animConsole(index, lines, withClause){

    withClause = withClause ? withClause: "";

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
        .type("myflow.py run" + withClause)
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
        if (line.pause)
            type.pause(line.pause);
    });
    type.pause(200);
    type.type("<span class='mf_done'>Flow successful ✨</span>");
    return type;
}

function animConsoleDeploy(index, cmd, version){
    let extra = "";
    if (version)
        extra = "Branch <b>" + version + "</b> runs in parallel with production"
    else
        extra = "It is scheduled to run every UTC midnight"        

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
        .type("myflow.py " + cmd)
        .break()
        .options({speed: 0, lifeLike: false})
        .pause(200)
        .type("<span class='mf_title'><b>Metaflow 2.1.0</b> deploying MyFlow</span>")
        .break()
        .type("Flow <b>MyFlow</b> deployed successfully! ⚙️")
        .break()
        .type(extra);
    return type;
}

function animConsoleNoop(index){
  let type = new TypeIt("#console",
        {
            speed: 200,
            lifeLike: true,
            startDelay: 100,
            afterComplete: function(){
                const nb = ANIM_NOTEBOOK["a" + index];
                ANIM_CONSOLE["a" + index].destroy();
                nb.go();
            }
        })
  return type;
}

function animConsoleResume(index, run_id, lines, error){

    let type = new TypeIt("#console",
        {
            speed: 200,
            lifeLike: true,
            startDelay: 100,
            afterComplete: function(){
                /*
                const nb = ANIM_NOTEBOOK["a" + index];
                ANIM_CONSOLE["a" + index].destroy();
                if (nb)
                    nb.go();
                else
                    setActive("a" + index);
                */
            }
        })
        .type(" ")
        .pause(500)
        .type("python ")
        .options({speed: 30})
        .type("myflow.py resume --origin-run-id " + run_id)
        .break()
        .options({speed: 0, lifeLike: false})
        .pause(200)
        .type("<span class='mf_title'><b>Metaflow 2.1.0</b> resuming MyFlow</span>")
        .break()
        .pause(600);
    lines.forEach(function(line){
        const pathspec = (index + 1) + "/" + line.step + "/" + (line.taskid ? line.taskid: 1);
        type.type("<span class='mf_tstamp'>[" + pathspec + "]</span> " + line.msg);
        type.break();
        if (line.pause)
            type.pause(line.pause);
    });
    type.type("<span class='mf_failed'>Task failed</span>").break();
    error.forEach(function(err){
        type.type(err);
        type.break();
    });
    type.pause(500);
    type.type("<span class='mf_tstamp'>Flow failed</span>");
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

function animNotebookInit(index, resumeType){
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

                if (resumeType)
                    resumeType.go();
                else
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
            ]),
        a2: animConsole(2, [
                {step: 'start', msg: ""},
                {step: 'end', msg: "fruits ['apple', 'orange', 'kiwi']"}
            ]),
        a3: animConsole(3, [
                {step: 'start', msg: ""},
                {step: 'train', msg: "Training a classifier...", pause: 2500},
                {step: 'end', msg: "model SVC(kernel='linear')"}
            ]),
        a4: animConsole(4, [
                {step: 'start', msg: "[pod af-345] Pod starting"},
                {step: 'train', msg: "[pod ex-638] Pod starting with 2 GPUs"},
                {step: 'train', msg: "[pod ex-638] Prompting Stable Diffusion...", pause: 6000},
                {step: 'end', msg: "[pod sq-934] Pod starting"}
            ], " --with kubernetes"),
        a5: animConsole(5, [
                {step: 'start', msg: "[pod af-1459] Pod starting"},
                {step: 'train', msg: "[pod ex-1511] Pod starting with 2 GPUs"},
                {step: 'train', msg: "[pod tr-1513] Pod starting with 2 GPUs"},
                {step: 'train', msg: "[pod ee-1514] Pod starting with 2 GPUs"},
                {step: 'train', msg: "[pod ow-1515] Pod starting with 2 GPUs", pause: 6000},
                {step: 'join', msg: "[pod za-1694] 4 images produced"},
                {step: 'end', msg: "[pod sq-934] Pod starting"}
            ], " --with kubernetes"),
        a6: animConsoleDeploy(6, "argo-workflows create"),
        a7: animConsoleDeploy(7, "--branch cnn_v2 argo-workflows create", "cnn_v2"),
        a8: animConsoleNoop(8),
        a8resume: animConsoleResume(8, "argo-44234", [
                {step: 'start', msg: "Cloning task argo-44234/start/1"},
                {step: 'train', msg: "Cloning task argo-44234/train/1"},
                {step: 'end', msg: "Starting task", pause: 1000},
            ], [
                "<span class='mf_tstamp'>[step end]</span> AttributeError:",
                "Flow MyFlow has no attribute 'img'"
            ])
    }

    ANIM_CODE['a0'] = animCodeInit(0)
        .move(49, {instant: true})
        .type('<span class="hljs-title class_ inherited__">FlowSpec</span>')
        .move(3)
        .break()
        .type('\t<span class="hljs-meta">@step</span>')
        .options({speed: 5, lifeLike: false})
        .move(36, {instant: true})
        .options({speed: 30, lifeLike: true})
        .type('\t\tself.next(self.end)')
        .break()
        .break()
        .type('\t<span class="hljs-meta">@step</span>');

    ANIM_CODE['a1'] = animCodeInit(1)
        .move(102, {instant: true})   
        .delete(14)
        .type("self.fruits = [<span class='hljs-string'>'apple'</span>, <span class='hljs-string'>'orange'</span>]")
        .move(46, {instant: true})
        .break()
        .type("\t\tself.fruits.append(<span class='hljs-string'>'kiwi'</span>)")
        .move(16, {instant: true})
        .delete(7)
        .type("<span class='hljs-string'>'fruits'</span>, self.fruits");

    ANIM_CODE['a2'] = animCodeInit(2)
        .move(150, {instant: true})
        .break()
        .type('\t<span class="hljs-meta">@card(type=<span class="hljs-string">"sketch"</span>)</span>')

    ANIM_CODE['a3'] = animCodeInit(3)
        .move(150, {instant: true})
        .delete(4)
        .type("train)")
        .break()
        .move(1)
        .type("\t<span class='hljs-meta'>@conda(libraries={<span class='hljs-string'>'scikit-learn': '1.0.2'</span>})</span>")
        .move(25, {instant: true})
        .break()
        .type("\t\t<span class='hljs-keyword'>from</span> scikit_model <span class='hljs-keyword'>import</span> fit")
        .break()
        .type("\t\tself.model = fit(self.fruits)")
        .break()
        .type("\t\tself.<span class='hljs-built_in'>next</span>(self.end)")

    ANIM_CODE['a4'] = animCodeInit(4)
        .move(164, {instant: true})
        .break()
        .type("\t<span class='hljs-meta'>@conda(libraries={<span class='hljs-string'>'stable-diffusion': '1.0.0'</span>})</span>")
        .break()
        .type("\t<span class='hljs-meta'>@resources(memory=<span class='hljs-number'>64000</span>, gpu=<span class='hljs-number'>2</span>)</span>")
        .move(25, {instant:true})
        .break()
        .type("\t\t<span class='hljs-keyword'>from</span> stable_diffusion <span class='hljs-keyword'>import</span> from_prompt")
        .break()
        .type('\t\tself.image = from_prompt(<span class="hljs-string">"Robot eating "</span> + self.fruits[<span class="hljs-number">0</span>])')
        .break()
        .type("\t\tself.<span class='hljs-built_in'>next</span>(self.end)")

    ANIM_CODE['a5'] = animCodeInit(5)
        .move(138, {instant: true})
        .delete(10)
        .move(1)
        .type(" * <span class='hljs-number'>4</span>")
        .move(24)
        .delete(1)
        .type(', foreach=<span class="hljs-string">"fruits"</span>)')
        .move(230, {instant: true})
        .delete(4)
        .type("join)")
        .move(33, {instant: true})
        .break()
        .type('\t\t\t<span class="hljs-built_in">print</span>(f<span class="hljs-string">"{len(inputs)} images produced"</span>)')
        .break()
        .type("\t\t\tself.<span class='hljs-built_in'>next</span>(self.end)")

    ANIM_CODE['a6'] = animCodeInit(6)
        .move(63, {instant: true})
        .break()
        .break()
        .type("<span class='hljs-meta'>@schedule(daily=True)</span>")

    ANIM_CODE['a7'] = animCodeInit(7)
        .move(62, {instant: true})
        .break()
        .break()
        .type("<span class='hljs-meta'>@project(name=<span class='hljs-string'>'recs'</span>)</span>")

    ANIM_CODE['a8'] = animCodeInit(8);
    ANIM_CODE['a8resume'] = animCodeInit(8);

    for (let i = 1; i < 8; i++)
        ANIM_NOTEBOOK['a' + i] = animNotebookInit(i);
    ANIM_NOTEBOOK['a8'] = animNotebookInit(8, ANIM_CONSOLE['a8resume']);

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