/*

    subtitle burn-in-ator
    
    this is io.js code used by nw.js

*/

// load standard libs
var gui = require('nw.gui');
var spawn = require('child_process').spawn;
var path = require('path')

// what's our ffmpeg path? should be included with this package
var ffmpeg_path = process.cwd() + '/ffmpeg';
var ffmpeg_process; // will eventually hold the process

// show me
console.log('Loaded, using ffmpeg: ' + ffmpeg_path);

// these will hold what we'll eventually be transcoding
var input_video_path = '';
var input_subtitle_path = '';
var output_video_path = '';

// prevent default behavior from changing page on dropped file
window.ondragover = function(e) { e.preventDefault(); return false };
window.ondrop = function(e) { e.preventDefault(); return false };

// listen for dropped files on the video drop box
var video_dropbox = document.getElementById('video-drop-box');
video_dropbox.ondragover = function () { return false; };
video_dropbox.ondragleave = function () { return false; };
video_dropbox.ondrop = function (e) {
    e.preventDefault();
    if (e.dataTransfer.files.length > 1) {
        alert('You can only drag one file at a time onto here.');
        return;
    }
    this.innerHTML = e.dataTransfer.files[0].name;
    input_video_path = e.dataTransfer.files[0].path;
    return false;
};

// listen for dropped files on the subtitle drop box
var subtitle_dropbox = document.getElementById('subtitle-drop-box');
subtitle_dropbox.ondragover = function () { return false; };
subtitle_dropbox.ondragleave = function () { return false; };
subtitle_dropbox.ondrop = function (e) {
    e.preventDefault();
    if (e.dataTransfer.files.length > 1) {
        alert('You can only drag one file at a time onto here.');
        return;
    }
    if (path.extname(e.dataTransfer.files[0].path).toLowerCase() != '.srt') {
        alert('This currently only accepts SRT subtitle files.');
        return;
    }
    this.innerHTML = e.dataTransfer.files[0].name;
    input_subtitle_path = e.dataTransfer.files[0].path;
    return false;
};

// listen for save as what changes
var output_field = document.getElementById('output-file');
output_field.addEventListener('change', function(e) {
    output_video_path = this.value;
    if (path.extname(output_video_path) != '.mp4') {
        output_video_path += '.mp4';
    }
});

// listen for the GO BUTTON press
var go_btn = document.getElementById('go');
go_btn.addEventListener('click', go_click);

var debug_output = document.getElementById('output-text');

// on click, start the process
function go_click(e) {
    
    // make sure all the ingredients are here
    if (input_video_path == '') {
        alert('No input video file selected! Please drop one in here.');
        return;
    }
    
    if (input_subtitle_path == '') {
        alert('No input subtitle file selected! Please drop one in here.');
        return;
    }
    
    if (output_video_path == '') {
        alert('No output file was selected! Please select one before continuing.');
        return;
    }
    
    console.log('using video file "'+input_video_path+'" and subtitle file "'+input_subtitle_path+'"');
    
    // switch things around on the view
    document.getElementById('input').style.display = 'none';
    document.getElementById('output').style.display = 'block';
    
    // set up an environment with the right fontconfig path set
    var ffmpeg_env = process.env;
    ffmpeg_env["FONTCONFIG_PATH"] = "/opt/X11/lib/X11/fontconfig";
    
    // ok, now run ffmpeg
    // example: ffmpeg -i input.mp4 -vf subtitles=input.srt -c:v libx264 -c:a libvo_aacenc -preset slow -crf 10 output-burnt.mp4
    ffmpeg_process = spawn(ffmpeg_path, ['-y', '-i', input_video_path, '-vf', 'subtitles='+input_subtitle_path, '-c:v', 'libx264', '-c:a', 'libvo_aacenc', '-preset', 'slow', '-crf', '10', output_video_path], { env: ffmpeg_env });
        
    var ffmpeg_process_stdout = '';
    var ffmpeg_process_stderr = '';
    
    // listen for stdout
    ffmpeg_process.stdout.on('data', function(data) {
    	ffmpeg_process_stdout += data;
        console.log('ffmpeg stdout: ' + data);
    });

    ffmpeg_process.stdout.on('end', function() {
    	//console.log('newthumb script final stdout: ' + ffmpeg_process_stdout);
        //console.log('ffmpeg stdout done');
    });

    // listen for stderr
    ffmpeg_process.stderr.on('data', function(data) {
    	ffmpeg_process_stderr += data;
        var current_data = ''+data+'';
        console.log('ffmpeg stderr: ' + current_data);
        // output ffmpeg progress for view
        if (current_data.substr(0, 6) == 'frame=') {
            debug_output.innerHTML = current_data;
        }
    });

    ffmpeg_process.stderr.on('end', function() {
    	//console.log('newthumb script final stderr: ' + ffmpeg_process_stderr);
        //console.log('ffmpeg stderr done');
    });
    
    // listen for when ffmpeg is done!
    ffmpeg_process.on('close', function(code) {
    	console.log('ffmpeg exited with code ' + code);
    	if (code == 0) {
    		// everything is cool enough, send resulting data along to client
    		console.log('everything finished fine, it seems');
            document.getElementById('output').style.display = 'none';
            document.getElementById('done').style.display = 'block';
    	} else {
    		// there was an error that we need to take care of
            console.log('something went wrong!');
            debug_output.innerHTML = '<b>SOMETHING WENT WRONG!</b><br />' + ffmpeg_process_stderr;
    	}
    });

    //ffmpeg_process.stdin.write();
    ffmpeg_process.stdin.end(); // do it!
    
}

// show the final file on button click
document.getElementById('show-output-btn').addEventListener('click', function(e) {
    gui.Shell.showItemInFolder(output_video_path);
});