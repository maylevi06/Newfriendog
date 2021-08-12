(function (cjs, an) {

var p; // shortcut to reference prototypes
var lib={};var ss={};var img={};
lib.ssMetadata = [
		{name:"ani_mid_atlas_1", frames: [[0,0,1475,1104]]},
		{name:"ani_mid_atlas_2", frames: [[0,0,1306,976],[0,978,1306,976]]},
		{name:"ani_mid_atlas_3", frames: [[0,978,1291,927],[0,0,1306,976]]},
		{name:"ani_mid_atlas_4", frames: [[0,0,1291,927],[0,929,1291,927]]},
		{name:"ani_mid_atlas_5", frames: [[0,0,1291,927],[0,929,1291,927]]},
		{name:"ani_mid_atlas_6", frames: [[0,0,1291,927],[0,929,1291,927]]},
		{name:"ani_mid_atlas_7", frames: [[0,722,1435,363],[0,1087,1435,363],[0,1452,1435,363],[0,0,1280,720]]},
		{name:"ani_mid_atlas_8", frames: [[682,1095,755,611],[0,0,1435,363],[0,365,1435,363],[0,730,1435,363],[0,1095,680,680]]},
		{name:"ani_mid_atlas_9", frames: [[0,0,755,611],[757,0,755,611],[0,613,755,611],[667,1226,1302,248],[0,1787,1302,250],[667,1476,1302,248],[0,1226,665,559]]},
		{name:"ani_mid_atlas_10", frames: [[1304,0,545,543],[0,500,545,543],[547,500,545,543],[0,0,1302,248],[0,250,1302,248],[1094,545,774,344],[1094,891,774,344],[0,1045,774,344],[0,1391,774,344],[776,1237,774,344],[776,1583,774,344]]},
		{name:"ani_mid_atlas_11", frames: [[1108,579,85,42],[1910,576,61,15],[1695,0,213,620],[1443,0,250,630],[1910,554,63,20],[805,827,219,502],[1008,466,54,13],[1026,879,219,502],[553,827,250,450],[1903,1326,97,273],[1910,278,97,274],[1903,1050,97,274],[1910,0,98,276],[237,1509,93,273],[2010,0,29,123],[0,1025,352,262],[1247,1335,271,170],[0,0,523,490],[1645,1050,256,305],[354,1279,251,305],[913,1383,181,216],[1703,1357,183,216],[354,1025,181,242],[1520,1357,181,242],[1703,1575,151,99],[1284,1507,180,146],[1096,1507,186,147],[607,1551,180,146],[0,1509,235,115],[0,1289,322,218],[607,1331,304,218],[553,466,453,107],[1108,632,551,245],[0,492,551,284],[0,778,551,245],[553,579,553,246],[1984,554,62,134],[1984,690,54,134],[2041,0,7,16],[1247,879,211,454],[1460,879,183,454],[2010,125,17,49],[789,1551,68,180],[332,1586,68,178],[2029,125,8,20],[2010,176,38,18],[2041,18,1,2],[1065,0,376,577],[1695,622,287,426],[525,0,538,464]]}
];


(lib.AnMovieClip = function(){
	this.actionFrames = [];
	this.ignorePause = false;
	this.currentSoundStreamInMovieclip;
	this.soundStreamDuration = new Map();
	this.streamSoundSymbolsList = [];

	this.gotoAndPlayForStreamSoundSync = function(positionOrLabel){
		cjs.MovieClip.prototype.gotoAndPlay.call(this,positionOrLabel);
	}
	this.gotoAndPlay = function(positionOrLabel){
		this.clearAllSoundStreams();
		var pos = this.timeline.resolve(positionOrLabel);
		if (pos != null) { this.startStreamSoundsForTargetedFrame(pos); }
		cjs.MovieClip.prototype.gotoAndPlay.call(this,positionOrLabel);
	}
	this.play = function(){
		this.clearAllSoundStreams();
		this.startStreamSoundsForTargetedFrame(this.currentFrame);
		cjs.MovieClip.prototype.play.call(this);
	}
	this.gotoAndStop = function(positionOrLabel){
		cjs.MovieClip.prototype.gotoAndStop.call(this,positionOrLabel);
		this.clearAllSoundStreams();
	}
	this.stop = function(){
		cjs.MovieClip.prototype.stop.call(this);
		this.clearAllSoundStreams();
	}
	this.startStreamSoundsForTargetedFrame = function(targetFrame){
		for(var index=0; index<this.streamSoundSymbolsList.length; index++){
			if(index <= targetFrame && this.streamSoundSymbolsList[index] != undefined){
				for(var i=0; i<this.streamSoundSymbolsList[index].length; i++){
					var sound = this.streamSoundSymbolsList[index][i];
					if(sound.endFrame > targetFrame){
						var targetPosition = Math.abs((((targetFrame - sound.startFrame)/lib.properties.fps) * 1000));
						var instance = playSound(sound.id);
						var remainingLoop = 0;
						if(sound.offset){
							targetPosition = targetPosition + sound.offset;
						}
						else if(sound.loop > 1){
							var loop = targetPosition /instance.duration;
							remainingLoop = Math.floor(sound.loop - loop);
							if(targetPosition == 0){ remainingLoop -= 1; }
							targetPosition = targetPosition % instance.duration;
						}
						instance.loop = remainingLoop;
						instance.position = Math.round(targetPosition);
						this.InsertIntoSoundStreamData(instance, sound.startFrame, sound.endFrame, sound.loop , sound.offset);
					}
				}
			}
		}
	}
	this.InsertIntoSoundStreamData = function(soundInstance, startIndex, endIndex, loopValue, offsetValue){ 
 		this.soundStreamDuration.set({instance:soundInstance}, {start: startIndex, end:endIndex, loop:loopValue, offset:offsetValue});
	}
	this.clearAllSoundStreams = function(){
		this.soundStreamDuration.forEach(function(value,key){
			key.instance.stop();
		});
 		this.soundStreamDuration.clear();
		this.currentSoundStreamInMovieclip = undefined;
	}
	this.stopSoundStreams = function(currentFrame){
		if(this.soundStreamDuration.size > 0){
			var _this = this;
			this.soundStreamDuration.forEach(function(value,key,arr){
				if((value.end) == currentFrame){
					key.instance.stop();
					if(_this.currentSoundStreamInMovieclip == key) { _this.currentSoundStreamInMovieclip = undefined; }
					arr.delete(key);
				}
			});
		}
	}

	this.computeCurrentSoundStreamInstance = function(currentFrame){
		if(this.currentSoundStreamInMovieclip == undefined){
			var _this = this;
			if(this.soundStreamDuration.size > 0){
				var maxDuration = 0;
				this.soundStreamDuration.forEach(function(value,key){
					if(value.end > maxDuration){
						maxDuration = value.end;
						_this.currentSoundStreamInMovieclip = key;
					}
				});
			}
		}
	}
	this.getDesiredFrame = function(currentFrame, calculatedDesiredFrame){
		for(var frameIndex in this.actionFrames){
			if((frameIndex > currentFrame) && (frameIndex < calculatedDesiredFrame)){
				return frameIndex;
			}
		}
		return calculatedDesiredFrame;
	}

	this.syncStreamSounds = function(){
		this.stopSoundStreams(this.currentFrame);
		this.computeCurrentSoundStreamInstance(this.currentFrame);
		if(this.currentSoundStreamInMovieclip != undefined){
			var soundInstance = this.currentSoundStreamInMovieclip.instance;
			if(soundInstance.position != 0){
				var soundValue = this.soundStreamDuration.get(this.currentSoundStreamInMovieclip);
				var soundPosition = (soundValue.offset?(soundInstance.position - soundValue.offset): soundInstance.position);
				var calculatedDesiredFrame = (soundValue.start)+((soundPosition/1000) * lib.properties.fps);
				if(soundValue.loop > 1){
					calculatedDesiredFrame +=(((((soundValue.loop - soundInstance.loop -1)*soundInstance.duration)) / 1000) * lib.properties.fps);
				}
				calculatedDesiredFrame = Math.floor(calculatedDesiredFrame);
				var deltaFrame = calculatedDesiredFrame - this.currentFrame;
				if((deltaFrame >= 0) && this.ignorePause){
					cjs.MovieClip.prototype.play.call(this);
					this.ignorePause = false;
				}
				else if(deltaFrame >= 2){
					this.gotoAndPlayForStreamSoundSync(this.getDesiredFrame(this.currentFrame,calculatedDesiredFrame));
				}
				else if(deltaFrame <= -2){
					cjs.MovieClip.prototype.stop.call(this);
					this.ignorePause = true;
				}
			}
		}
	}
}).prototype = p = new cjs.MovieClip();
// symbols:



(lib.CachedBmp_91 = function() {
	this.initialize(ss["ani_mid_atlas_11"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_90 = function() {
	this.initialize(ss["ani_mid_atlas_11"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_89 = function() {
	this.initialize(ss["ani_mid_atlas_11"]);
	this.gotoAndStop(2);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_87 = function() {
	this.initialize(ss["ani_mid_atlas_11"]);
	this.gotoAndStop(3);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_86 = function() {
	this.initialize(ss["ani_mid_atlas_11"]);
	this.gotoAndStop(4);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_85 = function() {
	this.initialize(ss["ani_mid_atlas_11"]);
	this.gotoAndStop(5);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_83 = function() {
	this.initialize(ss["ani_mid_atlas_11"]);
	this.gotoAndStop(6);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_82 = function() {
	this.initialize(ss["ani_mid_atlas_11"]);
	this.gotoAndStop(7);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_88 = function() {
	this.initialize(ss["ani_mid_atlas_11"]);
	this.gotoAndStop(8);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_80 = function() {
	this.initialize(ss["ani_mid_atlas_11"]);
	this.gotoAndStop(9);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_79 = function() {
	this.initialize(ss["ani_mid_atlas_11"]);
	this.gotoAndStop(10);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_78 = function() {
	this.initialize(ss["ani_mid_atlas_11"]);
	this.gotoAndStop(11);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_77 = function() {
	this.initialize(ss["ani_mid_atlas_11"]);
	this.gotoAndStop(12);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_76 = function() {
	this.initialize(ss["ani_mid_atlas_11"]);
	this.gotoAndStop(13);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_75 = function() {
	this.initialize(ss["ani_mid_atlas_11"]);
	this.gotoAndStop(14);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_73 = function() {
	this.initialize(ss["ani_mid_atlas_10"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_71 = function() {
	this.initialize(ss["ani_mid_atlas_10"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_74 = function() {
	this.initialize(ss["ani_mid_atlas_11"]);
	this.gotoAndStop(15);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_69 = function() {
	this.initialize(ss["ani_mid_atlas_10"]);
	this.gotoAndStop(2);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_68 = function() {
	this.initialize(ss["ani_mid_atlas_11"]);
	this.gotoAndStop(16);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_67 = function() {
	this.initialize(ss["ani_mid_atlas_11"]);
	this.gotoAndStop(17);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_66 = function() {
	this.initialize(ss["ani_mid_atlas_11"]);
	this.gotoAndStop(18);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_65 = function() {
	this.initialize(ss["ani_mid_atlas_11"]);
	this.gotoAndStop(19);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_64 = function() {
	this.initialize(ss["ani_mid_atlas_11"]);
	this.gotoAndStop(20);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_63 = function() {
	this.initialize(ss["ani_mid_atlas_11"]);
	this.gotoAndStop(21);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_62 = function() {
	this.initialize(ss["ani_mid_atlas_11"]);
	this.gotoAndStop(22);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_61 = function() {
	this.initialize(ss["ani_mid_atlas_11"]);
	this.gotoAndStop(23);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_60 = function() {
	this.initialize(ss["ani_mid_atlas_11"]);
	this.gotoAndStop(24);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_58 = function() {
	this.initialize(ss["ani_mid_atlas_11"]);
	this.gotoAndStop(25);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_57 = function() {
	this.initialize(ss["ani_mid_atlas_11"]);
	this.gotoAndStop(26);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_56 = function() {
	this.initialize(ss["ani_mid_atlas_11"]);
	this.gotoAndStop(27);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_55 = function() {
	this.initialize(ss["ani_mid_atlas_11"]);
	this.gotoAndStop(28);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_54 = function() {
	this.initialize(ss["ani_mid_atlas_11"]);
	this.gotoAndStop(29);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_53 = function() {
	this.initialize(ss["ani_mid_atlas_11"]);
	this.gotoAndStop(30);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_52 = function() {
	this.initialize(ss["ani_mid_atlas_2"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_51 = function() {
	this.initialize(ss["ani_mid_atlas_2"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_50 = function() {
	this.initialize(ss["ani_mid_atlas_11"]);
	this.gotoAndStop(31);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_49 = function() {
	this.initialize(ss["ani_mid_atlas_11"]);
	this.gotoAndStop(32);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_48 = function() {
	this.initialize(ss["ani_mid_atlas_11"]);
	this.gotoAndStop(33);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_47 = function() {
	this.initialize(ss["ani_mid_atlas_11"]);
	this.gotoAndStop(34);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_46 = function() {
	this.initialize(ss["ani_mid_atlas_11"]);
	this.gotoAndStop(35);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_45 = function() {
	this.initialize(ss["ani_mid_atlas_8"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_44 = function() {
	this.initialize(ss["ani_mid_atlas_9"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_43 = function() {
	this.initialize(ss["ani_mid_atlas_9"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_42 = function() {
	this.initialize(ss["ani_mid_atlas_9"]);
	this.gotoAndStop(2);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_41 = function() {
	this.initialize(ss["ani_mid_atlas_11"]);
	this.gotoAndStop(36);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_39 = function() {
	this.initialize(ss["ani_mid_atlas_11"]);
	this.gotoAndStop(37);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_40 = function() {
	this.initialize(ss["ani_mid_atlas_11"]);
	this.gotoAndStop(38);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_37 = function() {
	this.initialize(ss["ani_mid_atlas_11"]);
	this.gotoAndStop(39);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_35 = function() {
	this.initialize(ss["ani_mid_atlas_11"]);
	this.gotoAndStop(40);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_36 = function() {
	this.initialize(ss["ani_mid_atlas_11"]);
	this.gotoAndStop(41);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_33 = function() {
	this.initialize(ss["ani_mid_atlas_11"]);
	this.gotoAndStop(42);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_31 = function() {
	this.initialize(ss["ani_mid_atlas_11"]);
	this.gotoAndStop(43);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_32 = function() {
	this.initialize(ss["ani_mid_atlas_11"]);
	this.gotoAndStop(44);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_29 = function() {
	this.initialize(ss["ani_mid_atlas_11"]);
	this.gotoAndStop(45);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_28 = function() {
	this.initialize(ss["ani_mid_atlas_11"]);
	this.gotoAndStop(46);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_27 = function() {
	this.initialize(ss["ani_mid_atlas_9"]);
	this.gotoAndStop(3);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_26 = function() {
	this.initialize(ss["ani_mid_atlas_9"]);
	this.gotoAndStop(4);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_25 = function() {
	this.initialize(ss["ani_mid_atlas_9"]);
	this.gotoAndStop(5);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_24 = function() {
	this.initialize(ss["ani_mid_atlas_10"]);
	this.gotoAndStop(3);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_23 = function() {
	this.initialize(ss["ani_mid_atlas_10"]);
	this.gotoAndStop(4);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_22 = function() {
	this.initialize(ss["ani_mid_atlas_3"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_21 = function() {
	this.initialize(ss["ani_mid_atlas_4"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_20 = function() {
	this.initialize(ss["ani_mid_atlas_4"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_19 = function() {
	this.initialize(ss["ani_mid_atlas_5"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_18 = function() {
	this.initialize(ss["ani_mid_atlas_5"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_17 = function() {
	this.initialize(ss["ani_mid_atlas_6"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_16 = function() {
	this.initialize(ss["ani_mid_atlas_6"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_15 = function() {
	this.initialize(ss["ani_mid_atlas_3"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_14 = function() {
	this.initialize(ss["ani_mid_atlas_10"]);
	this.gotoAndStop(5);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_13 = function() {
	this.initialize(ss["ani_mid_atlas_10"]);
	this.gotoAndStop(6);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_12 = function() {
	this.initialize(ss["ani_mid_atlas_10"]);
	this.gotoAndStop(7);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_11 = function() {
	this.initialize(ss["ani_mid_atlas_10"]);
	this.gotoAndStop(8);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_10 = function() {
	this.initialize(ss["ani_mid_atlas_10"]);
	this.gotoAndStop(9);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_9 = function() {
	this.initialize(ss["ani_mid_atlas_10"]);
	this.gotoAndStop(10);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_8 = function() {
	this.initialize(ss["ani_mid_atlas_7"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_7 = function() {
	this.initialize(ss["ani_mid_atlas_7"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_6 = function() {
	this.initialize(ss["ani_mid_atlas_7"]);
	this.gotoAndStop(2);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_5 = function() {
	this.initialize(ss["ani_mid_atlas_8"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_4 = function() {
	this.initialize(ss["ani_mid_atlas_8"]);
	this.gotoAndStop(2);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_3 = function() {
	this.initialize(ss["ani_mid_atlas_8"]);
	this.gotoAndStop(3);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_2 = function() {
	this.initialize(ss["ani_mid_atlas_11"]);
	this.gotoAndStop(47);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_1 = function() {
	this.initialize(ss["ani_mid_atlas_9"]);
	this.gotoAndStop(6);
}).prototype = p = new cjs.Sprite();



(lib.Bitmap23 = function() {
	this.initialize(ss["ani_mid_atlas_11"]);
	this.gotoAndStop(48);
}).prototype = p = new cjs.Sprite();



(lib.paw = function() {
	this.initialize(ss["ani_mid_atlas_8"]);
	this.gotoAndStop(4);
}).prototype = p = new cjs.Sprite();



(lib.reka3 = function() {
	this.initialize(ss["ani_mid_atlas_1"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.telavivsignremovebgpreview = function() {
	this.initialize(ss["ani_mid_atlas_11"]);
	this.gotoAndStop(49);
}).prototype = p = new cjs.Sprite();



(lib.ברוכיםהבאים = function() {
	this.initialize(ss["ani_mid_atlas_7"]);
	this.gotoAndStop(3);
}).prototype = p = new cjs.Sprite();
// helper functions:

function mc_symbol_clone() {
	var clone = this._cloneProps(new this.constructor(this.mode, this.startPosition, this.loop, this.reversed));
	clone.gotoAndStop(this.currentFrame);
	clone.paused = this.paused;
	clone.framerate = this.framerate;
	return clone;
}

function getMCSymbolPrototype(symbol, nominalBounds, frameBounds) {
	var prototype = cjs.extend(symbol, cjs.MovieClip);
	prototype.clone = mc_symbol_clone;
	prototype.nominalBounds = nominalBounds;
	prototype.frameBounds = frameBounds;
	return prototype;
	}


(lib.Tween37 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_89();
	this.instance.setTransform(-54.45,-141.6,0.5,0.5);

	this.instance_1 = new lib.CachedBmp_88();
	this.instance_1.setTransform(-62.35,-168.35,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_1},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-62.3,-168.3,125,336.70000000000005);


(lib.Tween36 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_87();
	this.instance.setTransform(-62.35,-157.55,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-62.3,-157.5,125,315);


(lib.rl = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#3333FF").s().p("AArHVQgKgDgNgKIgxgnQgTgQgGgLQgIgPADgdQADgigDgMQgCgIgGgPQgHgQgCgHQgCgHgBgRQgBgPgCgIQgCgGgFgIIgGgOQgFgMAAgQIACgdQAAgRgIgyQgFgmgKhlQgGhGgBgmQgBgbACg5QADhKAGgeQAGggANgoQADgMAHgDQAGgDALAFQAfAMAlAcQAoAfATAfQANAUAIAdQAFAQAIAjIALA5QARBPAFAoQAEAiACAcQAEBCgGBAIgEApIgDAqIgCBEIgHA5QgFAjABAVIACAZIAAAZQgCAegTAOIgmgcQAFAQAMALQgFAIgKAAIgIgBgAgWjiQgBAUABAjQAIDBAaDAQgFgpAEg9QAIhEACgiQAKiSgpiOQgKAWgCAeg");
	this.shape.setTransform(6.6189,21.4902,0.5122,0.4571);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#000000").s().p("AgGCdQgJgGgDgEQgGgIAAgTIABjbQAAgfgEgOIgFgPQgCgJAAgGQAAgHAEgBIAFACIAhAYQAHAFADAEQACADABALQACAIAFARQADAMAAAYIgBDXQAAATADAIQACAFAAADIgBADQAAABgBAAQAAAAgBAAQAAABgBAAQAAAAgBAAIgkgag");
	this.shape_1.setTransform(8.055,51.325);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.rl, new cjs.Rectangle(0,0,13.3,69.6), null);


(lib.r_l_women = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_76();
	this.instance.setTransform(0,0,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.r_l_women, new cjs.Rectangle(0,0,46.5,136.5), null);


(lib.ll = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_75();
	this.instance.setTransform(0,0,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.ll, new cjs.Rectangle(0,0,14.5,61.5), null);


(lib.start_button = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.text = new cjs.Text("Click To Start", "17px 'Engravers MT'", "#333333");
	this.text.textAlign = "center";
	this.text.lineHeight = 22;
	this.text.lineWidth = 97;
	this.text.parent = this;
	this.text.setTransform(181.7,14.85);

	this.instance = new lib.CachedBmp_68();
	this.instance.setTransform(112.45,3.25,0.5,0.5);

	this.instance_1 = new lib.CachedBmp_67();
	this.instance_1.setTransform(0,0,0.5,0.5);

	this.instance_2 = new lib.CachedBmp_74();
	this.instance_2.setTransform(96.55,-26.65,0.5,0.5);

	this.instance_3 = new lib.CachedBmp_69();
	this.instance_3.setTransform(-11,-13.7,0.5,0.5);

	this.instance_4 = new lib.CachedBmp_71();
	this.instance_4.setTransform(-11,-13.7,0.5,0.5);

	this.instance_5 = new lib.CachedBmp_73();
	this.instance_5.setTransform(-11,-13.7,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_1},{t:this.instance},{t:this.text,p:{x:181.7,y:14.85,font:"17px 'Engravers MT'",lineHeight:21.8,lineWidth:97}}]}).to({state:[{t:this.instance_3},{t:this.instance_2},{t:this.text,p:{x:180.55,y:0.65,font:"24px 'Engravers MT'",lineHeight:29.95,lineWidth:117}}]},1).to({state:[{t:this.instance_4},{t:this.instance_2},{t:this.text,p:{x:180.55,y:0.65,font:"24px 'Engravers MT'",lineHeight:29.95,lineWidth:117}}]},1).to({state:[{t:this.instance_5},{t:this.instance_2},{t:this.text,p:{x:180.55,y:0.65,font:"24px 'Engravers MT'",lineHeight:29.95,lineWidth:117}}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-11,-26.6,283.6,284.40000000000003);


(lib.Tween34 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#8A593A").s().p("AAAAHQAAgHAAgGIABAAIAAALIAAACIgBAAg");
	this.shape.setTransform(7.175,11.175);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#CB7132").s().p("AgCAAIAAgBIAFADIgFgCg");
	this.shape_1.setTransform(5.4189,10.4633);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#603A23").s().p("AACAGIgFgGIAAgGIAHANIgBAAIgBgBg");
	this.shape_2.setTransform(3.325,10.325);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#A75E33").s().p("AAAgEIAAgBIABALIgBgKg");
	this.shape_3.setTransform(3.725,7.5069);

	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f("#AF5D30").s().p("AgBgEIAAgCIACANIgCgLg");
	this.shape_4.setTransform(1.55,2.6135);

	this.shape_5 = new cjs.Shape();
	this.shape_5.graphics.f("#E78B43").s().p("AgDgBQAQgCgPAFIAAAAQAAAAgBAAQAAAAAAgBQAAAAAAgBQAAAAAAgBg");
	this.shape_5.setTransform(5.2946,2.5623);

	this.shape_6 = new cjs.Shape();
	this.shape_6.graphics.f("#E78A43").s().p("AgFABQAYgFgYAGg");
	this.shape_6.setTransform(7.6875,0.974);

	this.shape_7 = new cjs.Shape();
	this.shape_7.graphics.f("#E88B42").s().p("AgFAAQAXgBgXACg");
	this.shape_7.setTransform(-4.7,-11.6281);

	this.shape_8 = new cjs.Shape();
	this.shape_8.graphics.f("#EC8944").s().p("AgTAAIAAgBQARgDAQADIAFABIABAAIgGACIgNABQgKAAgKgDg");
	this.shape_8.setTransform(-7.025,-12.0363);

	this.shape_9 = new cjs.Shape();
	this.shape_9.graphics.f("#B4602C").s().p("AgGAAQAcAAgcAAg");
	this.shape_9.setTransform(-3.5625,-10.55);

	this.shape_10 = new cjs.Shape();
	this.shape_10.graphics.f("#E98941").s().p("AgKAqIAAgDQANgTgDAfIgBACQAGALgDAJIgBABQgHgNgEgTgAAAhGIgBgDQAZADgXADg");
	this.shape_10.setTransform(6.9954,0.75);

	this.shape_11 = new cjs.Shape();
	this.shape_11.graphics.f("#E78C45").s().p("AgCAAIAAAAIAFABIgFgBg");
	this.shape_11.setTransform(3.9439,-5.6979);

	this.shape_12 = new cjs.Shape();
	this.shape_12.graphics.f("#F3A468").s().p("AASA3QgCgFgFgCIAAgBQgGgIgBgNIACgUQgLgEAFgQIgCAAIgSgqQARASAIAdIABAAQAAAEACABIABABQAFAKAHAIIAAABQgGAJAFAOIABAAQAAAMgDAGg");
	this.shape_12.setTransform(-0.975,-1.25);

	this.shape_13 = new cjs.Shape();
	this.shape_13.graphics.f("#C4712F").s().p("AAAAEIAAgBQgCgBAAgDIAAgCQAHgBgEAIIgBAAg");
	this.shape_13.setTransform(-0.0943,-2.0798);

	this.shape_14 = new cjs.Shape();
	this.shape_14.graphics.f("#E8873E").s().p("AgFgCQAXACgVACIAAABQgCAAAAgFg");
	this.shape_14.setTransform(2.233,-9.0479);

	this.shape_15 = new cjs.Shape();
	this.shape_15.graphics.f("#E88A42").s().p("AgKgCIAAgBQAOgJACAMQgBAGAGgFQgHAHgEAAQgGAAgEgKg");
	this.shape_15.setTransform(4.975,-7.237);

	this.shape_16 = new cjs.Shape();
	this.shape_16.graphics.f("#735134").s().p("AgBAKQgCgEAAgEQAEgDACgIIABAAIAAABQgBAIgDAFIAAADIAAACIgBAAIAAAAg");
	this.shape_16.setTransform(7.675,9.0375);

	this.shape_17 = new cjs.Shape();
	this.shape_17.graphics.f("#EA8942").s().p("AAcAsQANgTgGAUQgCAJgCAAQgCAAgBgKgAgkg0QASgEgMAIIgDACQgDAAAAgGg");
	this.shape_17.setTransform(6.7818,-2.982);

	this.shape_18 = new cjs.Shape();
	this.shape_18.graphics.f("#603B20").s().p("AgIAMIAAgDIAOgUIAAgCIACAAIABACIgBABIgQAYIAAgCg");
	this.shape_18.setTransform(8.925,6.6);

	this.shape_19 = new cjs.Shape();
	this.shape_19.graphics.f("#EA8A42").s().p("AgEANIgCgHQAEgMAEgEQAJgHgFAHIgEAEQgCADADgBQALAEgSAOg");
	this.shape_19.setTransform(8.5426,4.3685);

	this.shape_20 = new cjs.Shape();
	this.shape_20.graphics.f("#EA8940").s().p("AgFAAQANgLgCANIgFACIgCACQgEAAAAgGg");
	this.shape_20.setTransform(10.1684,-3.6379);

	this.shape_21 = new cjs.Shape();
	this.shape_21.graphics.f("#583D2B").s().p("AgMAcIgCAAIAAgCQAUgUAFgiIABAAIABAEIACABIAAABQgKAdgQAWIgBgBg");
	this.shape_21.setTransform(11.025,2.45);

	this.shape_22 = new cjs.Shape();
	this.shape_22.graphics.f("#7A6A5E").s().p("AAAALIAAgXQADAJgDAPIAAABIAAgCg");
	this.shape_22.setTransform(12.635,-1.575);

	this.shape_23 = new cjs.Shape();
	this.shape_23.graphics.f("#E98943").s().p("AARAWQgCgDAAgEQAPgNgIATQgBABAAABQAAAAgBABQAAAAAAAAQgBABAAAAQAAAAgBgBQAAAAAAAAQAAAAgBgBQAAAAAAgBgAgYgXIAAgBIAIAEIgIgDg");
	this.shape_23.setTransform(8.0755,-2.7987);

	this.shape_24 = new cjs.Shape();
	this.shape_24.graphics.f("#3F2011").s().p("AAFAWIgBgEIAAgEIAAgVIgBAAQgDgIgFgFIACgBIAAgBQAHAEACALIAAACIAAAWIAAACIAAACIAAACIgBgBg");
	this.shape_24.setTransform(11.9,-2.225);

	this.shape_25 = new cjs.Shape();
	this.shape_25.graphics.f("#492616").s().p("AARAQQgRgQgTgPIACAAIAAgBQAUAMAQARIABACIgBABIgCABIAAgBg");
	this.shape_25.setTransform(9.55,-6);

	this.shape_26 = new cjs.Shape();
	this.shape_26.graphics.f("#482919").s().p("AAUAMIgrgTIAAgEQAYAKAXAKIAAACIAAABIgCAAIgBAAIgBAAg");
	this.shape_26.setTransform(5.35,-8.7625);

	this.shape_27 = new cjs.Shape();
	this.shape_27.graphics.f("#D17F45").s().p("AA7CBIgBgBQgMgHgHgKIABgBIgIgOIgGgLIABgBQAFgKgOgGIAAACIgBgBIgBgCIACgBQAEgIgKgFIgDABIgBgDQAAgGgEgEIAAgBIAAgEQAFABACAFIAAADQADgHAAgLIgBAAQgGgPAHgIIAAgBQgIgHgEgLIABAAQADgKgGABIAAACIgCAAQgIgdgSgRIATAqIABAAQgEAQAMAFIgDASIgBAAQgMg/glgkIgCgCIAAgBQgKgFgHgHIgBgCIgLgGIAAgBQgOgKgaAEIAAgDIACgBIABgBIATgIIADgBIARABIACAAIAZgCIAAAAIACABIAGAAIAAABIgCABQAIAEAJADIACAAQAfAMAfAOIAsAUIACAAQATAPASARIAAABQAGAFADAIIABAAIAAAWIAAADIgBAAQgFAigVAUIAAACIgBACIgOAVIAAADIAAACIgBAAQgCAIgEAEQgBAEACAFIABAAIAAABIgCACIgDABQAAAHACAHIABAAQAGALgEABIgEABQgGAAgJgDgAA2BnQAMAIgNgJIABABgAA9AvIAAACQAEAUAIANIACgBQACgJgHgMIABgCQADgTgFAAQgCAAgGAIgAAnBGQAEAXgEgYIAAABgABaAhQgFAEgFAMIADAIIAAABQASgPgLgEQgEABADgDIAFgFIABgDIgFAEgAAQAVQAHAYgHgZIAAABgAAzAXQAAACAAABQAAABABAAQAAABAAAAQAAAAAAAAQANgFgJAAIgFAAgABiAOQAEAVADgUQADgKgCAAQgCAAgGAJgABJALIAAABIANgEIgNADgABigMQAAAFACACQACAFADgFQAFgMgDAAQgDAAgGAFgABigjQABAIAGgEIAFgCQABgIgDAAQgDAAgHAGgAA7gyQAPAFgPgGgAAng4QANACgNgDIAAABgABIg+IABADQAXgEgagDIACAEgAAphMIAAACQAHATAPgPQgGAFACgIQgCgGgFAAQgFAAgGADgAAhhSQAAAJAHgEQAIgGgGAAIgJABgAAVhXQAWgDgZgCQAAAFADAAgAgnhoQAdAAgdgBgAgxhzIAAABIALgCIgLABgAhWh5IAAABQAQAHARgFIAGgCIAAgBIgGAAQgIgCgJAAQgIAAgIACg");
	this.shape_27.setTransform(-0.25,0);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_27},{t:this.shape_26},{t:this.shape_25},{t:this.shape_24},{t:this.shape_23},{t:this.shape_22},{t:this.shape_21},{t:this.shape_20},{t:this.shape_19},{t:this.shape_18},{t:this.shape_17},{t:this.shape_16},{t:this.shape_15},{t:this.shape_14},{t:this.shape_13},{t:this.shape_12},{t:this.shape_11},{t:this.shape_10},{t:this.shape_9},{t:this.shape_8},{t:this.shape_7},{t:this.shape_6},{t:this.shape_5},{t:this.shape_4},{t:this.shape_3},{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-12.7,-13.2,25.5,26.5);


(lib.Tween33 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#603A23").s().p("AADAIIgBgCIgFgHIAAgGIAHAPg");
	this.shape.setTransform(3.325,11.025);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#CB7132").s().p("AgCgBIAAgBIAFAFIgFgEg");
	this.shape_1.setTransform(5.4189,11.5132);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#8A593A").s().p("AAAAHIAAgNIABAAIAAALIAAACIgBAAg");
	this.shape_2.setTransform(7.175,12.525);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#A75E33").s().p("AAAgEIAAgBIABALIgBgKg");
	this.shape_3.setTransform(3.725,8.2818);

	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f("#AF5D30").s().p("AgBgEIAAgCIACANIgCgLg");
	this.shape_4.setTransform(1.55,3.0385);

	this.shape_5 = new cjs.Shape();
	this.shape_5.graphics.f("#E78B43").s().p("AgDgBQAQABgPACQgBAAAAgDg");
	this.shape_5.setTransform(5.2946,3.55);

	this.shape_6 = new cjs.Shape();
	this.shape_6.graphics.f("#E78A43").s().p("AgFAAQAYgBgYACg");
	this.shape_6.setTransform(7.6875,2.3719);

	this.shape_7 = new cjs.Shape();
	this.shape_7.graphics.f("#B4602C").s().p("AgGAAIAAgBIANADIgNgCg");
	this.shape_7.setTransform(-3.5625,-10.8987);

	this.shape_8 = new cjs.Shape();
	this.shape_8.graphics.f("#E88B42").s().p("AgFAAIAAAAIAKABIgKgBg");
	this.shape_8.setTransform(-4.7,-12.2219);

	this.shape_9 = new cjs.Shape();
	this.shape_9.graphics.f("#EC8944").s().p("AgTgCIAAgBQARgBAQAFIAFABIABABIgGABIgFAAQgOAAgOgGg");
	this.shape_9.setTransform(-7.025,-12.9714);

	this.shape_10 = new cjs.Shape();
	this.shape_10.graphics.f("#E8873E").s().p("AgFgCQAXAFgVAAQgCAAAAgFg");
	this.shape_10.setTransform(2.233,-8.575);

	this.shape_11 = new cjs.Shape();
	this.shape_11.graphics.f("#E98941").s().p("AgKAoIAAgCQANgSgDAfIgBABQAGANgDAJIgBAAQgHgOgEgUgAAAhGIgBgDQAZAHgXAAg");
	this.shape_11.setTransform(6.9954,2.025);

	this.shape_12 = new cjs.Shape();
	this.shape_12.graphics.f("#E78C45").s().p("AgCAAIAAgBIAFADIgFgCg");
	this.shape_12.setTransform(3.9439,-4.8864);

	this.shape_13 = new cjs.Shape();
	this.shape_13.graphics.f("#E88A42").s().p("AgKgDIAAgCQAOgGACALQgBAHAGgEQgGAFgEAAQgHAAgEgLg");
	this.shape_13.setTransform(4.975,-6.2708);

	this.shape_14 = new cjs.Shape();
	this.shape_14.graphics.f("#F3A468").s().p("AASA6QgCgFgFgDIAAgBQgGgJgBgNIACgUQgLgGAFgPIgCAAIgSgtQARAVAIAdIABABQAAAEACACIABABQAFAKAHAJIAAACQgGAHAFAQIABAAQAAAMgDAFg");
	this.shape_14.setTransform(-0.975,-1.225);

	this.shape_15 = new cjs.Shape();
	this.shape_15.graphics.f("#C4712F").s().p("AAAAFIAAgBQgCgCAAgEIAAgCQAHAAgEAJIgBAAg");
	this.shape_15.setTransform(-0.0943,-1.9);

	this.shape_16 = new cjs.Shape();
	this.shape_16.graphics.f("#735134").s().p("AgBAKQgCgFAAgEQAEgCACgIIABAAIAAACQgBAHgDAEIAAAEIAAACIgBAAg");
	this.shape_16.setTransform(7.675,10.45);

	this.shape_17 = new cjs.Shape();
	this.shape_17.graphics.f("#603B20").s().p("AgIALIAAgEIAOgRIAAgCIACABIABABIgBACIgQAVIAAgCg");
	this.shape_17.setTransform(8.925,8.175);

	this.shape_18 = new cjs.Shape();
	this.shape_18.graphics.f("#EA8A42").s().p("AgEAMIgCgIQAEgKAEgEQAJgFgFAGIgEADQgCADADgBQALAFgSAMg");
	this.shape_18.setTransform(8.5426,5.9185);

	this.shape_19 = new cjs.Shape();
	this.shape_19.graphics.f("#EA8942").s().p("AAcAwQANgRgGAUQgCAIgBAAQgCAAgCgLgAgkg6QASgBgMAHIgDABQgDAAAAgHg");
	this.shape_19.setTransform(6.7818,-1.705);

	this.shape_20 = new cjs.Shape();
	this.shape_20.graphics.f("#E98943").s().p("AARAaQgCgEAAgEQAPgLgIASQgBABAAAAQAAABgBAAQAAAAAAABQgBAAAAAAQAAAAAAAAQgBAAAAgBQAAAAgBAAQAAgBAAAAgAgYgaIAAgBIAIAFIgIgEg");
	this.shape_20.setTransform(8.0755,-1.3684);

	this.shape_21 = new cjs.Shape();
	this.shape_21.graphics.f("#7A6A5E").s().p("AAAALIAAgXQADAKgDAOIAAABIAAgCg");
	this.shape_21.setTransform(12.635,0.575);

	this.shape_22 = new cjs.Shape();
	this.shape_22.graphics.f("#583D2B").s().p("AgMAaIgCgBIAAgCQAUgQAFghIABAAIABAFIACAAIAAACQgKAbgQATIgBgBg");
	this.shape_22.setTransform(11.025,4.375);

	this.shape_23 = new cjs.Shape();
	this.shape_23.graphics.f("#EA8940").s().p("AgFAAQANgKgCANIgFABIgCABQgDAAgBgFg");
	this.shape_23.setTransform(10.1684,-1.8321);

	this.shape_24 = new cjs.Shape();
	this.shape_24.graphics.f("#D17F45").s().p("ABKCRQgGgBgJgFIgBgBQgMgJgHgLIABAAIgIgQIgGgLIABgBQAFgKgOgIIAAACIgBAAIgBgDIACgBQAEgHgKgHIgDAAIgBgCQAAgGgEgFIAAgBIAAgEQAFACACAFIAAADQADgGAAgLIgBgBQgGgPAHgIIAAgBQgIgIgEgMIABAAQADgJgGAAIAAACIgCAAQgIgegSgVIATAtIABABQgEAPAMAHIgDASIgBAAQgMhBglgqIgCgCIAAgBQgKgHgHgIIgBgCIgLgHIAAgCQgOgNgaAAIAAgCIACAAIABgCIATgFIADAAQAJACAIABIACABIAZACIAAgBIACACIAGABIAAABIgCAAQAIAGAJAEIACABQAfARAfASIAsAcIACAAIAlAlIAAABQAGAGADAJIABAAIAAAVIAAADIgBAAQgFAigVARIAAACIgBABIgOATIAAADIAAACIgBAAQgCAIgEADQgBAFACAEIABAAIAAACIgCACIgDAAIACAOIABAAQAGAMgEABIgCAAIgCAAgAA2BxQAMAJgNgKIABABgAA9A6IAAACQAEAUAIAOIACAAQACgJgHgNIABgBQADgUgFAAQgDAAgFAHgAAnBOQAEAXgEgZIAAACgABaAwQgFAEgFALIADAIIAAABQASgMgLgGQgEABADgDIAFgDQAAgBABgBQAAAAAAgBQAAAAAAAAQAAgBAAAAIgFADgABiAfQAEAVADgTQADgKgCAAQgCAAgGAIgAA0AmQAQgEgRgBQABAFAAAAgAAQAZQAHAZgHgbIAAACgABJAXIAAABIAMgBIgMAAgABiAEQAAAEACAEQACAEADgFQAFgLgEAAQgCAAgGAEgABigTQABAJAGgDIAFgCQABgIgEAAQgDAAgGAEgAA7goQAPAIgPgJgABIgyIABAEQAXAAgagHIACADgAAngxQANAFgNgGIAAABgAAphEIAAACQAHAUAPgNQgGAEACgHQgCgIgHAAQgEAAgFACgAAhhLQAAAJAHgEQAJgGgKAAIgGABgAAVhSQAWAAgZgGQAAAGADAAgAgnhtQAdAFgdgGgAgxh5QAYABgYgCgAhWiFIAAABQAQAJARgCIAGgBIAAgBIgGgBQgOgGgPAAIgEABg");
	this.shape_24.setTransform(-0.25,0.0375);

	this.shape_25 = new cjs.Shape();
	this.shape_25.graphics.f("#3F2011").s().p("AAFAXIgBgFIAAgDIAAgWIgBAAQgDgJgFgFIACgBIAAgBQAHAGACAKIAAACIAAAXIAAACIAAABIAAADIgBgBg");
	this.shape_25.setTransform(11.9,-0.15);

	this.shape_26 = new cjs.Shape();
	this.shape_26.graphics.f("#492616").s().p("AARATIgkgkIACgBIAAgBQAUAQAQAUIABABIgBABIgCABIAAgBg");
	this.shape_26.setTransform(9.55,-4.325);

	this.shape_27 = new cjs.Shape();
	this.shape_27.graphics.f("#482919").s().p("AAUAPIgrgaIAAgEQAYAOAXAOIAAABIAAABIgCABIgCgBg");
	this.shape_27.setTransform(5.35,-7.75);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_27},{t:this.shape_26},{t:this.shape_25},{t:this.shape_24},{t:this.shape_23},{t:this.shape_22},{t:this.shape_21},{t:this.shape_20},{t:this.shape_19},{t:this.shape_18},{t:this.shape_17},{t:this.shape_16},{t:this.shape_15},{t:this.shape_14},{t:this.shape_13},{t:this.shape_12},{t:this.shape_11},{t:this.shape_10},{t:this.shape_9},{t:this.shape_8},{t:this.shape_7},{t:this.shape_6},{t:this.shape_5},{t:this.shape_4},{t:this.shape_3},{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-12.7,-14.5,25.5,29.1);


(lib.Tween32 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#E26E2B").s().p("AgKADIAGgCIgCgCIALgDIgBgDIAFgCIACAHIgFABIABADIgGABIAAAEIgKADg");
	this.shape.setTransform(-0.6,4.725);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#E06B29").s().p("AgIASIgLADIAAgDIALgDIgDgKIALgDIgBgDIALgDIgCgGIAGgCIgCgHIAGgBIACAKIgGABIACAHIgLACIABAEIgGABIACAHIgEABIABAHIgGABg");
	this.shape_1.setTransform(2.325,1.675);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#E16E2B").s().p("AAFADIgFACIAAgEIgGACIgBgDIgFABIgDgJIgGABIgBgCIAMgDIABAGIAGgCIABAEIAFgCIACAGIAFAAIABACIALgCIABACIgFACIABAEIgGABIABADIgGACg");
	this.shape_2.setTransform(2.375,-5.2);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#EE8C4F").s().p("AhEBAIAigJIgBgDIAMgEIgBgDIALgDIAAgDIAFgCIgBgDIAGgCIgBgDIAFgBIgBgDIAFgCIgBgEIAGgBIgCgHIAGgBIgBgDIAGgCIgDgJIAGgCIgJgiIgGACIgBgEIgGACIAAgGIgGABIgCgHIgGABIgBgDIgFACIgBgDIgGABIgBgEIgFACIgBgDIgGABIgBgDIgGABIAAgCIgGABIgBgDIAMgEIAcgHIABAEIAQgFIABADIALgDIABAEIAGgCIABADIAFgBIABADIAGgBIABACIAFgBIABADIAGgBIADAKIAGgCIAMAwIgGACIACAGIgGACIABACIgFABIACAIIgGABIACAHIgGABIABADIgGACIABADIgGACIABADIgLADIABADIgGABIABAEIgGACIABADIgLADIABAEIgGABIAAACIhDATgAAjgCIACAGIgGABIACAHIgMADIABAEIgLACIADAKIgLAEIAAACIgFACIABAEIgLADIABACIgGACIACAHIALgDIAAgEIAEgBIAAgDIAFgCIgCgHIALgCIABADIAGgBIgBgHIAFgBIgCgHIAGgCIgBgDIALgDIgCgHIAGgCIgCgJgAAgglIAFgCIgBgDIAGgBIgBgEIAFgCIgBgDIgLADIAAgDIgGABIgCgHIgGACIgBgEIgFACIgCgGIgLADIAAACIAGgBIADAKIAGgBIABADIAFgCIABAEIAGgCg");
	this.shape_3.setTransform(0.025,0);

	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f("#E6C4B0").s().p("AgEAFIgFABIgCgGIAWgHIABAEIgLADIABACIAFgBIABADIgLADg");
	this.shape_4.setTransform(-5.5,-6.45);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_4},{t:this.shape_3},{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-6.9,-7.7,13.9,15.4);


(lib.Tween31 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#E26E2B").s().p("AgLAHIAAgHIAGAAIAAgDIALAAIAAgDIAGAAIAAAGIgGAAIAAAEIgGAAIAAADg");
	this.shape.setTransform(-1.125,5.6);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#E6C4B0").s().p("AgFAFIAAgDIgGAAIAAgGIAXAAIAAADIgMAAIAAADIAGAAIAAADg");
	this.shape_1.setTransform(-2.9,-6.375);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#E06B29").s().p("AgLARIAAgDIgLAAIAAgDIALAAIAAgLIALAAIAAgCIAMAAIAAgHIAFAAIAAgHIAHAAIAAAKIgHAAIAAAGIgLAAIAAAEIgGAAIAAAHIgFAAIAAAGg");
	this.shape_2.setTransform(2.4,3.525);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#E16E2B").s().p("AADAQIAAgLIgFAAIAAgDIgGAAIAAgDIgGAAIAAgKIgFAAIAAgEIALAAIAAAHIAGAAIAAAEIAFAAIAAAGIAGAAIAAADIALAAIAAAEIgFAAIAAADIgGAAIAAAEg");
	this.shape_3.setTransform(4.45,-3.275);

	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f("#EE8C4F").s().p("AhMBDIAAgNIAkAAIAAgDIAMAAIAAgEIAMAAIAAgDIAFAAIAAgDIAGAAIAAgEIAFAAIAAgDIAGAAIAAgEIAGAAIAAgHIAGAAIAAgDIAGAAIAAgLIAGAAIAAgiIgGAAIAAgDIgGAAIAAgHIgGAAIAAgHIgGAAIAAgEIgGAAIAAgDIgFAAIAAgEIgGAAIAAgDIgFAAIAAgDIgGAAIAAgEIgGAAIAAgDIAMAAIAcAAIAAADIASAAIAAAEIALAAIAAADIAGAAIAAADIAGAAIAAAEIAGAAIAAADIAGAAIAAAEIAGAAIAAAKIAGAAIAAAwIgGAAIAAAHIgGAAIAAAEIgGAAIAAAHIgGAAIAAAHIgGAAIAAADIgGAAIAAADIgFAAIAAAEIgMAAIAAADIgGAAIAAAEIgGAAIAAADIgMAAIAAAEIgFAAIAAACgAgWA9IALAAIAAgDIAGAAIAAgEIAFAAIAAgHIAMAAIAAAEIAGAAIAAgHIAGAAIAAgHIAGAAIAAgDIALAAIAAgHIAGAAIAAgLIgGAAIAAAHIgFAAIAAAHIgMAAIAAAEIgMAAIAAAKIgMAAIAAADIgFAAIAAAEIgLAAIAAADIgGAAgAAYguIAGAAIAAALIAGAAIAAADIAFAAIAAAEIAGAAIAAAKIAGAAIAAgDIAGAAIAAgEIAGAAIAAgDIgMAAIAAgEIgGAAIAAgHIgGAAIAAgDIgFAAIAAgHIgMAAg");
	this.shape_4.setTransform(0.025,0.175);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_4},{t:this.shape_3},{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-7.6,-6.9,15.3,13.8);


(lib.Tween30 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_66();
	this.instance.setTransform(-64.05,-76.15,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-64,-76.1,128,152.5);


(lib.Tween29 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_65();
	this.instance.setTransform(-62.7,-76.15,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-62.7,-76.1,125.5,152.5);


(lib.Tween27 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#332017").s().p("AgIADQAZgPgLANQgEAFgEAAQgDAAgDgDg");
	this.shape.setTransform(45.1408,57.7142);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#6E4E3F").s().p("AgEACQATgQgTAUg");
	this.shape_1.setTransform(18.9375,66.6497);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#AD9989").s().p("AgBANIAAgCIAAgYIADAAIAAAYIAAACIgDAAg");
	this.shape_2.setTransform(62.525,46.35);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#70503F").s().p("Ah3CrIgDABQgdAKgmABIgDgBIgGgCQBDgZAygvQAKAIAIgLQALgVANgFQAbgLAIgMQAbgCARgZQgBgFgGgBQhRgMg5AqQg1ABgfAYQgWARgJABQAQgUAIgfQAXhUArhDQAYASAkAJQgOgXAYAXQAGAAgMgcQgRgmACgoIANAdQAYA2ApAlQAnAkAiApIABgBQAOgCAYgQQA/gsAxgfIAAADIAAADIgDAAIAAAYIAAADIgBAGQgNAoAOAdIgBADQgOAmgYAdIgDAAQgNAIgPAHQguAXgrAYQgzAcgzAAQgmAAgmgPgAAlA1QAHAHAHgJQAFgGgCAAQgEAAgNAIg");
	this.shape_3.setTransform(40.575,52.6636);

	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f("#444444").s().p("AAAABIgBAAIAAgBIADAAIAAABIgCAAg");
	this.shape_4.setTransform(-20.425,76.05);

	this.shape_5 = new cjs.Shape();
	this.shape_5.graphics.f("#614F46").s().p("AgbgBIAzAAIAEAAIAAABQgcACgbAAIAAgDg");
	this.shape_5.setTransform(9.4,72.7);

	this.shape_6 = new cjs.Shape();
	this.shape_6.graphics.f("#684739").s().p("AgKADIAPgFQADgBABAAQABAAAAAAQABAAgBAAQgBAAgCABIgRAGg");
	this.shape_6.setTransform(10.4522,71.6678);

	this.shape_7 = new cjs.Shape();
	this.shape_7.graphics.f("#94592F").s().p("AgxBQQAMgBgDgOIgCAAIAAgDQAqgTAJgyIAAgDIADgDQAMgZAGgdIAFgIQADgHAGACQAJgBgDAOQgTBKgkA2QgPAVgSAAQgGAAgFgCg");
	this.shape_7.setTransform(6.4471,56.6941);

	this.shape_8 = new cjs.Shape();
	this.shape_8.graphics.f("#5E4D46").s().p("AgPgBIAYAAIADAAIAEAAIAAABQgQABgPAAIAAgCg");
	this.shape_8.setTransform(-10.975,64.5);

	this.shape_9 = new cjs.Shape();
	this.shape_9.graphics.f("#C1A79A").s().p("AAKABIgXAAIAAgBQANgBAOABIAAABIgEAAg");
	this.shape_9.setTransform(-11.15,64.2);

	this.shape_10 = new cjs.Shape();
	this.shape_10.graphics.f("#C3AC9E").s().p("AghBAIgDAAIgBgDIgDgMIAAgEQAngoAbg1QAFgIAIgHIACAAQgGAagKAXIAAgFQgTATgLAeIgCABQgKAVgQAGIACAGg");
	this.shape_10.setTransform(8.275,44.975);

	this.shape_11 = new cjs.Shape();
	this.shape_11.graphics.f("#D1BFB5").s().p("AgiA6QgKgNgCgTQAXg1AcgcIgDgBIgDgCIAmADIADAAIADACIAEABQgIAGgFAIQgcA1gmApIAAADIgCgBg");
	this.shape_11.setTransform(7.5,43.925);

	this.shape_12 = new cjs.Shape();
	this.shape_12.graphics.f("#FAF9F7").s().p("AAHBNQgigNAOgyIAAgDQgWglgJgyIAzARIAEABIAYADIADAAIAEACIADABQgcAcgXA1QADATAIANIACABIADAMIABADIgEAAg");
	this.shape_12.setTransform(3.475,43.625);

	this.shape_13 = new cjs.Shape();
	this.shape_13.graphics.f("#634036").s().p("AAaAwIgDAAIgmgDIgDAAIgYgDIAAgDQA3gKgIhNIAEAAIAHAAQAoAdgTBAQgBAEgFAAIgFgBg");
	this.shape_13.setTransform(8.8669,33.5141);

	this.shape_14 = new cjs.Shape();
	this.shape_14.graphics.f("#D2AB8C").s().p("AgSAAIAiAAIADAAIAAAAQgTABgSABIAAgCg");
	this.shape_14.setTransform(-8.875,10.9);

	this.shape_15 = new cjs.Shape();
	this.shape_15.graphics.f("#BC865D").s().p("AgGgBIADgBIABgCIAJAGIAAACIgDABIgDAAQgDAAgEgGg");
	this.shape_15.setTransform(-21.6,10.0938);

	this.shape_16 = new cjs.Shape();
	this.shape_16.graphics.f("#8F8D8E").s().p("AgDgEIAAgCIAHANIgHgLg");
	this.shape_16.setTransform(-15.5937,2.4202);

	this.shape_17 = new cjs.Shape();
	this.shape_17.graphics.f("#D0C457").s().p("AgKAMIgKgBIAAgDQAUgIAPgMIACgBQAAADACADIACAAIgBACQgQAIgNALIgBgCg");
	this.shape_17.setTransform(-4.175,-10.575);

	this.shape_18 = new cjs.Shape();
	this.shape_18.graphics.f("#ECEAC6").s().p("AgBAtQgZghgSgmQAMgLATgGIAAgBIAKABIABACIgDAAQgIALgOAEQANAhAWAZIACABQAUgHAPgLIAAADIAAADQgQASgdAGIgBAAg");
	this.shape_18.setTransform(-4.875,-4.975);

	this.shape_19 = new cjs.Shape();
	this.shape_19.graphics.f("#D3CB5A").s().p("AgLAJIAAgDIAAgDQALgEAGgJIADgBIACABIABACIgCABQgIAMgNAHIAAgDg");
	this.shape_19.setTransform(0.875,-4.075);

	this.shape_20 = new cjs.Shape();
	this.shape_20.graphics.f("#70716C").s().p("AACAJIgBgDQgBgSgSgOIADAAIAEAAQAnATgLAiIgCAAQAFgMgSgGg");
	this.shape_20.setTransform(4.3842,-11.325);

	this.shape_21 = new cjs.Shape();
	this.shape_21.graphics.f("#8B8B88").s().p("AggA/QgWgagNgiQANgDAJgLIACAAQAOgKARgKIAAgCQAZgWAXgHIAEAAIAAACIgEAAIgDAAQATAPABATIABACQASAGgFANIAAACIgpAbIAAADIgDABQgHAJgLAFIAAAEQgPAKgTAIIgDgBg");
	this.shape_21.setTransform(-0.8218,-8);

	this.shape_22 = new cjs.Shape();
	this.shape_22.graphics.f("#BDB118").s().p("AgbASQgCgCAAgDIAAgDQAWgUAfgHQACgBAEAFIgEAAIAAADIgDAAQgXAIgZAVIgCgBg");
	this.shape_22.setTransform(0.525,-13.2025);

	this.shape_23 = new cjs.Shape();
	this.shape_23.graphics.f("#B9B119").s().p("AgbAwIgBgCIgCgBIAAgDIAogcIAAgCIACAAQALgigngTIAAgDIAAgDIADAAIADAAQAZAWAQAfIAAACQgMANgTAGIAAADQgHASgRAAIgDAAg");
	this.shape_23.setTransform(4.875,-9.8196);

	this.shape_24 = new cjs.Shape();
	this.shape_24.graphics.f("#333333").s().p("AAAA6QgHgjgdgeQASgVAMgeIACAAQASAKAOAaIAJAWIgBABQgOAggUAaIgCgBg");
	this.shape_24.setTransform(10.625,-19.05);

	this.shape_25 = new cjs.Shape();
	this.shape_25.graphics.f("#BF8961").s().p("AAEAHIgKgOQAPgBgCANIgBADIgCgBg");
	this.shape_25.setTransform(-25.3836,16.3677);

	this.shape_26 = new cjs.Shape();
	this.shape_26.graphics.f("#FBF9F7").s().p("AAAAoIgBgCQgOgLgHgRIgCgBIghgRIAAgCIgKgHIgBgCQgKgLgNgIIAAgDIADAAQA5AHAjAbIABACQAQAFAXgCQATAAATgBIAAgCIADAAIAEAAIABACIACABQgSAsg2AAQgKAAgKgCg");
	this.shape_26.setTransform(-15.15,11.305);

	this.shape_27 = new cjs.Shape();
	this.shape_27.graphics.f("#F3E7DD").s().p("AAJAGQgNgEgLgHQAQACAOAEIAAACIgDAAIAAADIgDAAg");
	this.shape_27.setTransform(-25.6,6.825);

	this.shape_28 = new cjs.Shape();
	this.shape_28.graphics.f("#D1AA8F").s().p("AAAAOQgBgOAAgNIADAAIAAAYIAAADg");
	this.shape_28.setTransform(-30.825,7.575);

	this.shape_29 = new cjs.Shape();
	this.shape_29.graphics.f("#8D8D8E").s().p("AgBgHIAAgDIADAVIgDgSg");
	this.shape_29.setTransform(-24.8375,0.9888);

	this.shape_30 = new cjs.Shape();
	this.shape_30.graphics.f("#E7BDBC").s().p("AgCAGIAAgGQgIALgKgLQAHgEAFgGIACgBQAcgLgLAOQgDADAJABIAEACQgCAFgDAEQgJAKgEAAQgEAAgBgLg");
	this.shape_30.setTransform(-50.5,-12.5476);

	this.shape_31 = new cjs.Shape();
	this.shape_31.graphics.f("#90785F").s().p("AAGAIIgRgQIAWAMIABACIgDAAIAAADIgDgBg");
	this.shape_31.setTransform(-56.925,-19.2);

	this.shape_32 = new cjs.Shape();
	this.shape_32.graphics.f("#825637").s().p("AgEACQASgWgSAcg");
	this.shape_32.setTransform(-44.1375,-20.321);

	this.shape_33 = new cjs.Shape();
	this.shape_33.graphics.f("#7B614C").s().p("AAGAEIgEAAQgHgCgGgDIADgBIABgCIANAEIADABIACABQABABAAAAQAAABgBAAQAAABAAAAQgBAAgBAAIgDgBg");
	this.shape_33.setTransform(-51.4368,-15.6942);

	this.shape_34 = new cjs.Shape();
	this.shape_34.graphics.f("#5F513E").s().p("AgggIIAAgDQgJgLgFgQQANAKALAMIABACQACAHAHADIABACIARAQIADABQAQALATAKIADAAIAAADIgEAAQgtgQgegfg");
	this.shape_34.setTransform(-56.95,-19.825);

	this.shape_35 = new cjs.Shape();
	this.shape_35.graphics.f("#D9B6AB").s().p("AgSARQgJgBADgEQALgNgdAKIAAgDQAPgGgLgDIgBgCQAHACgBgEIgCgBIgBgDIgDgDIAEAAQAfAJAigMIADAAQgOAFALAAQAUABgKAHIgVAHIAHAHIAAACIgCgBQgYgQgOAUIAAADIgEgBg");
	this.shape_35.setTransform(-46.8722,-14.675);

	this.shape_36 = new cjs.Shape();
	this.shape_36.graphics.f("#C29C7F").s().p("AAYAOIgOgFIgDAAQgRgJgRgLIAAgDIAEAAQAWAOAcAHIABACIgEAAIADADIABADIgEgBg");
	this.shape_36.setTransform(-53.275,-17.1);

	this.shape_37 = new cjs.Shape();
	this.shape_37.graphics.f("#3F3E3E").s().p("AAaAkQgWgNgTgRIAAgCQgMgHgCgRIAAgDIAAgMQAOAKAUACIAEAAIACABQARAMACAuIgEAAg");
	this.shape_37.setTransform(-28.025,0.475);

	this.shape_38 = new cjs.Shape();
	this.shape_38.graphics.f("#916340").s().p("AAOAOQgCgEgHACIgDgBQgOgHgDgSQARAJANARIABADIgCgBg");
	this.shape_38.setTransform(-38.475,-13.75);

	this.shape_39 = new cjs.Shape();
	this.shape_39.graphics.f("#C79069").s().p("AAOA3QgCgPAAgQIAAgCQgTgSgIgbIAAgCQgXgLgPgRQAHgCABAEIADABQAKADAKAFIADABIAPALIADABQAlAdARAxIABADIgEAAQgVgCgOgKIAAAMIAAADg");
	this.shape_39.setTransform(-32.55,-7.1308);

	this.shape_40 = new cjs.Shape();
	this.shape_40.graphics.f("#825638").s().p("AAHAJIgNgLIAAgDIgEgDQAQACAEANIABACIgEAAg");
	this.shape_40.setTransform(-33.8,-11.05);

	this.shape_41 = new cjs.Shape();
	this.shape_41.graphics.f("#825837").s().p("AgJgEIATAEQgEAFgEAAQgFAAgGgJg");
	this.shape_41.setTransform(-37.3,-14.4067);

	this.shape_42 = new cjs.Shape();
	this.shape_42.graphics.f("#7E5839").s().p("AACAIIgDgCQgHgCACgIQAGgHACAFQAJAPgGAAIgDgBg");
	this.shape_42.setTransform(-34.4796,-13.879);

	this.shape_43 = new cjs.Shape();
	this.shape_43.graphics.f("#815837").s().p("AgFgDQAVABgTAGIAAAAQgCAAAAgHg");
	this.shape_43.setTransform(-38.428,-16.3986);

	this.shape_44 = new cjs.Shape();
	this.shape_44.graphics.f("#DED4CC").s().p("AgNAPIgBgCIgGgHIAUgHQAKgHgTgBQgLAAAOgFQARgCAJAGIABACQgVAIAFAJQAHAGgTAAIgGAAg");
	this.shape_44.setTransform(-42.85,-14.9837);

	this.shape_45 = new cjs.Shape();
	this.shape_45.graphics.f("#4C4C4B").s().p("AAAAPQgBgPAAgOIADAAIAAAaIAAADIgCAAg");
	this.shape_45.setTransform(-62.525,-27.675);

	this.shape_46 = new cjs.Shape();
	this.shape_46.graphics.f("#2B2920").s().p("AgEBJIgBgCQgLgMgNgLIAAgCQgHgHAAgOIAAgEIAAgaIAAgDIAAgMQADgdAJgWIACAAIACAAQgBAGgEAFQAGAeAYgLIAEgBIAbAcQAFAdgTAXIgDABQgcAIgGAFQANAOABAHg");
	this.shape_46.setTransform(-58.6569,-28.6);

	this.shape_47 = new cjs.Shape();
	this.shape_47.graphics.f("#B1825E").s().p("AgWgGIAIgGIADAAQALAjADghQABgFgFAAIABgCQAKgIANAZQAAAGgEADQgPALgJAAQgPAAgCgag");
	this.shape_47.setTransform(-47.525,-40.2934);

	this.shape_48 = new cjs.Shape();
	this.shape_48.graphics.f("#100B08").s().p("AgHgHIAHgCIADgBQAFABAAAFQgCAPgEAAQgDAAgGgSg");
	this.shape_48.setTransform(-47.9729,-40.8176);

	this.shape_49 = new cjs.Shape();
	this.shape_49.graphics.f("#60482F").s().p("ACLC5QgEgOgRgCIADAEIABACIgDAAQgKgFgLgDIgBgDQgNgTgSgIIgBgDIgGgEIAAgBQgKgHgSACIgDAAQgiAMgfgJIgBgCQgdgHgWgPIgBgCIgYgNIAAgCQgHgEgDgGIADAAQgBgHgNgOQAGgFAdgIIADgBQATgXgFgdIgbgcIgEABQgZALgGgeQAEgFABgGIgCAAIAAgEQAhgOAkgLIABgCQgCgnAOgjQAAgBAFAAQAFAAAGgMQAAADABABIACABQAXAJAFAAQAIAWAMgHIAAAHQALgEANAIIAAABQAKARAPAKIADABQAGAPAJALIADABQACAVALANIABACQgLAHgIAIIgCAAQgKAbgNAYIgCAAQAKAKALAUIAAAEQAhAcAcAiIACABQAKAVAHAHIAAADQgLAQAGAdQAAAAAAABQAAAAAAAAQgBAAAAABQAAAAgBAAIAAgCgABzCSQgCAIAHADIAEABQAKAEgKgTQAAAAgBgBQAAAAAAAAQgBgBAAAAQAAAAgBAAQgCAAgEAFgABoCRIgUgFQAJASALgNgABPCBQAUgGgWgCQgBAIADAAgAAVBYIAAAGQAKgQgBAAIgJAKgAgJiDIAAACIgEAAIgHADIgDAAIgHAGQACAsAmgcQAEgCAAgIQgKgTgHAAQgDAAgDACg");
	this.shape_49.setTransform(-46.675,-28.9);

	this.shape_50 = new cjs.Shape();
	this.shape_50.graphics.f("#EEE7E0").s().p("AgKALQgCgCAAgDQAKgGAFgKQAAgBAAAAQAAAAAAAAQAAAAABAAQAAAAABAAIAAACQAVAOgiAEIAAADIgCgBg");
	this.shape_50.setTransform(-49.9097,-48.275);

	this.shape_51 = new cjs.Shape();
	this.shape_51.graphics.f("#434546").s().p("AgIAJIAAgDIAOgQQAAAAABgBQAAAAAAAAQAAAAABAAQAAAAABAAIAAADIAAADQgBAAAAAAQgBAAAAAAQAAAAAAAAQAAAAAAABQgGAKgJAGIAAgDg");
	this.shape_51.setTransform(-50.325,-48.875);

	this.shape_52 = new cjs.Shape();
	this.shape_52.graphics.f("#ACA5A0").s().p("AgEAEIAAgDIAAgCIAAgDQAEgDAFABIAAACIAAADQgDAGgGACIAAgDg");
	this.shape_52.setTransform(-48.925,-50.2);

	this.shape_53 = new cjs.Shape();
	this.shape_53.graphics.f("#DAB69C").s().p("AgQABIAAgCQAQAAARABIABABIgEAAIgPABIgPgBg");
	this.shape_53.setTransform(-39.35,-53.8875);

	this.shape_54 = new cjs.Shape();
	this.shape_54.graphics.f("#420706").s().p("AglA2QALgjARgbQASgdAagVIAAgCIADAAIgGA0IgDArIAAADQgGAHgGAEQgJAFgMAEQgKADgHAAQgMAAgEgHg");
	this.shape_54.setTransform(-35.25,-62.7189);

	this.shape_55 = new cjs.Shape();
	this.shape_55.graphics.f("#D4AF92").s().p("AAKABIgXAAIAAgCIAbABIAAABIgEAAg");
	this.shape_55.setTransform(-23.675,-76);

	this.shape_56 = new cjs.Shape();
	this.shape_56.graphics.f("#1C1B1A").s().p("AAJAdQgNgbgTgIIAAgDIAAgEQAJgPAEgSIABgDQANAOAKAUIAAACQASAdgMAhIgCABIgJgVg");
	this.shape_56.setTransform(12.5441,-24.2);

	this.shape_57 = new cjs.Shape();
	this.shape_57.graphics.f("#430503").s().p("AgQB4QgQgLABgcQAtg2gJhZIgBgPQgEgcgLgZQAhAbAIApQAHAlgNAwIgYBcIACADQAJANgGAAQgFAAgQgLg");
	this.shape_57.setTransform(-22.8499,-57.3364);

	this.shape_58 = new cjs.Shape();
	this.shape_58.graphics.f("#6B4739").s().p("AAEBDQADhLgQg3IAAgDIAAgCIADAAQAbA/gRBKIAAgCg");
	this.shape_58.setTransform(28.8865,9.25);

	this.shape_59 = new cjs.Shape();
	this.shape_59.graphics.f("#BC875F").s().p("AAAgGIAAgDIABATIgBgQg");
	this.shape_59.setTransform(25.225,-11.2859);

	this.shape_60 = new cjs.Shape();
	this.shape_60.graphics.f("#B28B71").s().p("AjrGYQgJgOAAgXIAJgQIABgCQAVgVAjgHIACABQADAOgMAAQAZAJATgcQAlg2AThKQADgOgJABQgGgDgDAIIgFAHQgGAegMAYIgDAEIgBgDQgNgTgKgVIABAAIgBgGQAPgGAKgUIACgBQAMgfAUgTIAAAEQAJgXAGgZIgBAAIgEgBIgDgCQAJACABgFQAUhBgpgcIgHAAIgDAAQAIBNg5AKIAAADIgDgBIg1gRQAKAyAVAmIABADQgPAyAkANIgHAAIgEABQgHAugDAvIgBACQgrAfhHADIgEAAIAAgBQgOgCgOAAIAAADIAAADIgDAAQgtgBgHgmQAJglAhgMQAkgNAMgjIAAgDQABgcgKgTIg3hvIhIiWQAEgZAmAFQAOABAEgLQghAAAUgLQAIgEATAAQBIAKAWg1IgDgBIgBgCIAIAAQgaABgmgKQAWADANgCIAEgBQARgIAKgQIABgDQAegEAQgTIACgBQAfgFgJAOQgEAHAOgEQAKgIgJgXIgBgFQAkABAQgTQADgEAHABQAHABAAgFQgRgUAVAIIADAAQANgSAagGIADAAQAOgUASgPIADgBQAZADANgLQAEgEAJAAQAGAAABAGQAQgJgbgOQgBAAAAAAQABgBAAAAQABAAABAAQABAAABAAIAHgBQABgYAIAeQADANAGAMQAAgWADgVIAAgFQABBHAMBGQABAFADAFQASA2gEBMIAAADQAShMgcg/IAAgDQgNgxACg/IAHgQIAAgDQBGBNA9BWQAqA6A2AuQA4AwAgBKIATAqQAJAUAGAYIAABLIAAAEQgxAfg/AsQgZARgNABIgCACQghgrgogkQgpglgZg1IgMgdQgCAnARAnQAMAcgGAAQgYgXANAXQgjgKgYgSQgrBEgXBVQgJAegPAUQAKAAAVgSQAegXA1gBQA5grBTAMQAGABABAGQgSAZgcACQgIALgaALQgOAFgLAVQgHALgKgIQgzAvhCAaIAFABIAEACIgEAAQghABgeAHIgaAHIgEAAIg0AAIAAADQgUAEgZACIgHAAQgkAAgOgUgAhaGYIgPAFIAAACIARgHIAEgCIgGACgAgPFqIAAAEQALgMgBAAIgKAIg");
	this.shape_60.setTransform(20.025,30.6221);

	this.shape_61 = new cjs.Shape();
	this.shape_61.graphics.f("#C2865E").s().p("AgGgCIACgBIACgCIAIAGIABACIgCABQAAAAgBABQAAAAgBABQAAAAgBAAQAAAAAAAAQgDAAgFgIg");
	this.shape_61.setTransform(22.3,-20.7109);

	this.shape_62 = new cjs.Shape();
	this.shape_62.graphics.f("#B07447").s().p("AhxHcQgLgLgJgNIAAgEQADgOgRACIgCgBQgbgcgQglIAAgEIAAgYIAAgDIAAgMQAKgMAAgVIAAgDQAUARAWAMIAEABQgCgvgRgMIgCgCIgBgDQgSgwglgfQAAAAABAAQAAgBAAAAQAAAAAAAAQAAgBAAAAQgFgdALgQIgBgDQgHgHgKgVIgCgBQgcgigggcIgBgEQgLgUgJgKIACAAQANgYAJgbIADAAQAIgIAKgHIgBgCQgKgNgDgVIgCgBQgKgLgFgPIgDgBQgQgKgJgRIgBgBQgMgIgLAEIAAgHQgNAHgIgWQgGAAgWgJIAAgDQAjgEgVgPIAAgCQAHgCADgHIAAgDQAbgXArgHIADAAIAgAAIADAAQApAAAIgkIAFgOQAAAAAAAAQAAAAAAgBQgBAAAAAAQAAgBgBAAIAAgDIAEgsIAFg1IgCAAIAAgCQATgeAWgaIABgCQALgGAOgEIAYAAIADAAQAaAGAOASQAAAAAAAAQAAABABAAQAAAAAAAAQABAAAAAAQAUAvAPAzQAQA1ALA6IABAGQAiAYAlAXQAzAiAlAxIAmAxQASAYARAYIAAADQgFARgJAPIAAAEIAAADIgCAAQgLAdgSAWQAdAeAHAkIACABQAVgbAOgfIAAgDIACgBQAMghgRgeQAwAMAfAdIABACIgBACIgDAAQAIAQAEgJIACAAQAcAmASAyIADAFIgBAEIgGAPQgDBAANAwIAAADIgDAAIAAADIAAADQgEgFgBgEQgLhGgBhIIgBAGQgCAUgBAWQgFgMgEgMQgIgfAAAYIgHABQgCAAgBAAQgBAAAAABQgBAAAAAAQAAAAAAAAQAbAPgPAIQgCgFgFgBQgJAAgFAEQgMALgbgDIgCABQgTAPgNAUIgEAAQgZAHgNARIgEAAQgVgHASATQAAAGgHgBQgHgCgDAEQgRATgkgBIABAGQAJAWgKAIQgNAEAEgHQAJgOgfAFIgDABQgPATgfAFIgBACQgJAQgSAJIgDAAQgOACgUgCQAkAJAagBIgHABIgEAAIgDAAIgEAAIgjAAIAAADQgVABgQgEIgBgDQgkgbg5gGIgBgDQgOgFgQgCQAKAIAOAEIADABQAOAHAKAMIABABIgBACIgDACQAGAKAFgEIADgBIAgASIADABQAHARANALIABACQgTABgIADQgUALAhAAQgDAMgOgCQgmgEgEAZIgBgDgAgtEsQAPAZgQgcIABADgAiIEaQAIApgIgtIAAAEgACOCCQgfAGgWAWIAAACIgDABQgPANgUAIIAAADIgBABQgTAGgMALQASAnAZAhIADAAQAcgFARgTQAOgGAIgOIACgBQATACAJgUIAAgDQATgGAMgNIAAgCQgQgggagWIgDgBQgDgEgCAAIgBABgAFsCgQAFAjgFglIAAACgAhvlzIACAQQAJBagvA2QAAAbAQALQAjAXgQgYIgCgDIAYhcQANgxgHglQgIgqgigaQALAZAEAbg");
	this.shape_62.setTransform(-11.325,-28);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_62},{t:this.shape_61},{t:this.shape_60},{t:this.shape_59},{t:this.shape_58},{t:this.shape_57},{t:this.shape_56},{t:this.shape_55},{t:this.shape_54},{t:this.shape_53},{t:this.shape_52},{t:this.shape_51},{t:this.shape_50},{t:this.shape_49},{t:this.shape_48},{t:this.shape_47},{t:this.shape_46},{t:this.shape_45},{t:this.shape_44},{t:this.shape_43},{t:this.shape_42},{t:this.shape_41},{t:this.shape_40},{t:this.shape_39},{t:this.shape_38},{t:this.shape_37},{t:this.shape_36},{t:this.shape_35},{t:this.shape_34},{t:this.shape_33},{t:this.shape_32},{t:this.shape_31},{t:this.shape_30},{t:this.shape_29},{t:this.shape_28},{t:this.shape_27},{t:this.shape_26},{t:this.shape_25},{t:this.shape_24},{t:this.shape_23},{t:this.shape_22},{t:this.shape_21},{t:this.shape_20},{t:this.shape_19},{t:this.shape_18},{t:this.shape_17},{t:this.shape_16},{t:this.shape_15},{t:this.shape_14},{t:this.shape_13},{t:this.shape_12},{t:this.shape_11},{t:this.shape_10},{t:this.shape_9},{t:this.shape_8},{t:this.shape_7},{t:this.shape_6},{t:this.shape_5},{t:this.shape_4},{t:this.shape_3},{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-62.7,-76.1,125.4,152.3);


(lib.Tween25 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_63();
	this.instance.setTransform(-45.8,-54.05,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-45.8,-54,91.5,108);


(lib.Tween24 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#D8C6B5").s().p("AguAHQAxAIgEgZIAAgCIADAAQAdAEAQATIAAABQgPACgQAAQgeAAgggHg");
	this.shape.setTransform(40.25,42.5);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#AC9281").s().p("AgNAJIgBgCQgGgFAAgKQATAMATgBIADAAIAAABQgMAFgOAAIgIAAg");
	this.shape_1.setTransform(-33.0518,57.515);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#B39989").s().p("AACAKIAAgCQgCgKgEgHQALACgCAPIAAACIgDAAg");
	this.shape_2.setTransform(-36.0167,57.05);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#A9928A").s().p("AgQgJQAOgDAQAAIAEAAIgBADQgFAWgJAAQgHAAgMgWg");
	this.shape_3.setTransform(-38.3,44.525);

	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f("#806C5C").s().p("AAAAMQgBgMAAgLIADAAIAAAUIAAADIgCAAg");
	this.shape_4.setTransform(-16.525,40.25);

	this.shape_5 = new cjs.Shape();
	this.shape_5.graphics.f("#5F5F5F").s().p("AgRgBIAfAAIADAAIAAACIgDAAIgLABQgLAAgJgDg");
	this.shape_5.setTransform(-6.6,44.9786);

	this.shape_6 = new cjs.Shape();
	this.shape_6.graphics.f("#CFBEAE").s().p("AAAAKQgHgFABgNIADgBIABgCQALACgCAPIAAADIgDABIgEACIAAgCg");
	this.shape_6.setTransform(4.1965,50.825);

	this.shape_7 = new cjs.Shape();
	this.shape_7.graphics.f("#ACACAC").s().p("AAMACIgbAAIAAgDQAPAAAPABIABACIgEAAg");
	this.shape_7.setTransform(-3.275,44.95);

	this.shape_8 = new cjs.Shape();
	this.shape_8.graphics.f("#7B5836").s().p("AAHAKQgHAAgNgDIAAgDIAAgDQAigYgKAeIAAADIgEAAg");
	this.shape_8.setTransform(1.7111,44.3796);

	this.shape_9 = new cjs.Shape();
	this.shape_9.graphics.f("#FAFAF9").s().p("ABQAjIgRAAIgBgCQgPgBgQAAIgDAAIgfAAIhMAAIAAgDQgBgRgDgNIAAgDIAAgVIAAgDIAAgDQAXgIAbAQIADABQAVAPAaAKIAAABIAqAAQAMANALAOIACABIAAADIgEAAg");
	this.shape_9.setTransform(-8,41.6194);

	this.shape_10 = new cjs.Shape();
	this.shape_10.graphics.f("#7A5632").s().p("AgDANQADgXADgFIAAAEQADAbgFAAQgBAAgDgDg");
	this.shape_10.setTransform(2.5364,40.4673);

	this.shape_11 = new cjs.Shape();
	this.shape_11.graphics.f("#F5F0EC").s().p("AAAAEIAAgBQgHABABgIIAGAAIAEAAIABADQAFAGgHAAIgDgBg");
	this.shape_11.setTransform(21.9345,57.9559);

	this.shape_12 = new cjs.Shape();
	this.shape_12.graphics.f("#E7E1DA").s().p("AhNgDQAcADAigIIAEgBQASAGATACIAAgCQARgIAgACIADAAIAAACQgNAHgLAIIgDABQgVABgTAAQgzAAglgNg");
	this.shape_12.setTransform(14.125,59.389);

	this.shape_13 = new cjs.Shape();
	this.shape_13.graphics.f("#D4C3B4").s().p("AgDAeIgDAAQgiAIgcgDIgCAAQgEgogPgcIADgDIADAAQAUAXAwgHQAIgCAKAFQAHAEAIgLQAcAEAOARQAEAFADgEQACgEAEgDQAOAIAEASIAAAEIgEAAIgHAAQgCAIAJgBIAAACIgDAAQgggDgRAIIAAACQgTgBgTgGg");
	this.shape_13.setTransform(13.25,55.45);

	this.shape_14 = new cjs.Shape();
	this.shape_14.graphics.f("#6B492F").s().p("AANAXQgIgjgYAMIAAgDIAAgJQANgXAZAcQADAEgGAPQgCAFAAAGIgBAAg");
	this.shape_14.setTransform(21.552,48.2114);

	this.shape_15 = new cjs.Shape();
	this.shape_15.graphics.f("#F9F7F3").s().p("AAPAeIgEAAIgKAAIAAgCQgBAAAAAAQAAAAgBgBQAAAAAAAAQgBAAAAgBQgGgagHgXIACgBIABgCQAJgDALAAIADAAQAFAkABAXg");
	this.shape_15.setTransform(15.6,43.275);

	this.shape_16 = new cjs.Shape();
	this.shape_16.graphics.f("#B09C8D").s().p("AgEgHIgBgDIALAVIgKgSg");
	this.shape_16.setTransform(34.0128,48.8889);

	this.shape_17 = new cjs.Shape();
	this.shape_17.graphics.f("#BDA391").s().p("AgFAIQgEgIAAgFQAHgFAMADIAAACIgCABIgKAKIAAADIgDgBg");
	this.shape_17.setTransform(30.325,46.915);

	this.shape_18 = new cjs.Shape();
	this.shape_18.graphics.f("#D4C4B6").s().p("AgQAcIgBACQgcAFgfgWIAAgDIAAgOQAPgWAbAEIAEAAQASAmgBgdIAAgGIAAgDIALgLIACgBQANADAEgEIAAgCQAWAFARAJIADABQAHAPAKAMIABACIgBADQgIAZgQACIgRABQgbAAgYgKgAAWgQQAVAmgWgpIABADg");
	this.shape_18.setTransform(31.375,49.8221);

	this.shape_19 = new cjs.Shape();
	this.shape_19.graphics.f("#784D24").s().p("AgQAnQAAgpgGgiQAggMALAyQACAGgBAKQgBANgMAFIgEAAQgLAAgJADg");
	this.shape_19.setTransform(15.8563,36.6348);

	this.shape_20 = new cjs.Shape();
	this.shape_20.graphics.f("#8E5623").s().p("AgfhvIAAgDQAoAnARA7QAFASAAATQABA7gWAjQgPhvgahzg");
	this.shape_20.setTransform(2.1521,26);

	this.shape_21 = new cjs.Shape();
	this.shape_21.graphics.f("#DFCDB9").s().p("AgBAPIABgDIgBgaQAGALgFASg");
	this.shape_21.setTransform(10.642,3.6);

	this.shape_22 = new cjs.Shape();
	this.shape_22.graphics.f("#905A29").s().p("AAEAnIgNgYIAAgDQAAgWgDgTQAFgDADgGIACAAQAYAXgNA2IgBAAIgEAAg");
	this.shape_22.setTransform(-0.7139,5.125);

	this.shape_23 = new cjs.Shape();
	this.shape_23.graphics.f("#D6C1AA").s().p("AAAAMQgBgMAAgLQAEAHgCANIAAADg");
	this.shape_23.setTransform(10.0017,-1.25);

	this.shape_24 = new cjs.Shape();
	this.shape_24.graphics.f("#211D16").s().p("AAPAXQgOgNgSAOIAAgEIAAgSQAEgZAKAAIACAEQALATAHAYIgCgBg");
	this.shape_24.setTransform(-22.6,26.075);

	this.shape_25 = new cjs.Shape();
	this.shape_25.graphics.f("#F4EDE8").s().p("AASBNQgagOgZgOIgBgBQgMANgCgNQAMgagFgUIAAgCIAAgDIA2glIABgCQgEgeAcAGIAAgEQgDgRAOAJIgBADQgIAagFAfQAAAOAGAHIABACQgEANAAASIAAADIAAACQgIAJgCANIAAADIgEAQIgGgFg");
	this.shape_25.setTransform(-29.575,37.2583);

	this.shape_26 = new cjs.Shape();
	this.shape_26.graphics.f("#65472E").s().p("AhHBAQgBgRAEgNIAAgDQgHgHAAgOQAFgeAJgbIAAgDIAAgDIAAgGIAEAAQASgNAOAMIADABQAqA8A4AwIgCAAIgDgBQgagQgXAIIAAADIAAADIgEAAQgCgCgCAMIgBACQgQgCgvgBIgBACQgJAHgLADIAAgDg");
	this.shape_26.setTransform(-18.525,34.4495);

	this.shape_27 = new cjs.Shape();
	this.shape_27.graphics.f("#DFCAC0").s().p("AAABmIAAgDQACgQgLgCQAFAIACAKIAAADQg2ALglgUIABgGQAFgYAMgSIACgBQAOgNAPgKIgDAAQgpAFgFgdQAFgFACgHIAAgDQAPgQAYgIIADAAQAYAsAKgsIABgDIAAgDQAFgZACgbIAAgDQAKAIAHgKIADgBIAAADQAFAUgMAaQACANAMgNIABABQAYAOAcAOIAFAFIAEgQIABADQANAmgOAiQgFADgBAEQgHAogcAQIgEAAQgUACgSgOQgBAMAHAEIABACIAAACQgHAAgEgFg");
	this.shape_27.setTransform(-35.5061,47.875);

	this.shape_28 = new cjs.Shape();
	this.shape_28.graphics.f("#8E5724").s().p("AADAcQgUAAAGgQQADgHgFgMQAKgEgBgRIABAAQAPAFACATIAAADIAAACQABAcgIAAIgEgBg");
	this.shape_28.setTransform(-26.096,7.4278);

	this.shape_29 = new cjs.Shape();
	this.shape_29.graphics.f("#E0CFBB").s().p("AAAAPQgBgPAAgOIADAAIAAAaIAAADg");
	this.shape_29.setTransform(-35.325,-0.65);

	this.shape_30 = new cjs.Shape();
	this.shape_30.graphics.f("#E3D7CE").s().p("AAJAJIgDgBIgRgQIADAAQAOAAAGAOIAAADIgDAAg");
	this.shape_30.setTransform(-27.675,1.175);

	this.shape_31 = new cjs.Shape();
	this.shape_31.graphics.f("#DAC3A7").s().p("AAAAMQgBgMAAgLIADAAIAAAUIAAADIgCAAg");
	this.shape_31.setTransform(-5.375,12.675);

	this.shape_32 = new cjs.Shape();
	this.shape_32.graphics.f("#DDC6B2").s().p("AgDAAIAAgDIAAgGIADAAIAAADQAFAQgCAAQgBAAgFgKg");
	this.shape_32.setTransform(-22.94,14.271);

	this.shape_33 = new cjs.Shape();
	this.shape_33.graphics.f("#D5B598").s().p("AAAAOQgBgOAAgMQAFAHgDAQIAAADg");
	this.shape_33.setTransform(-24.1382,10.1);

	this.shape_34 = new cjs.Shape();
	this.shape_34.graphics.f("#F4F2EF").s().p("AARBmQgWgPgWgSQgVAAgKgMQAAgBABAAQAAAAAAgBQAAAAABgBQAAAAAAAAQAEgYgGgeIgCAAQgDgKgJgCIAAgDIAAgVIgCgBQgQgYgYAWIAAADIgDAAIAAAGIAAADIgCAAQgEgNgBgOIAAgDQACgQgGgIIAAgDIAAgMIAAgDIAAgDQAHAUAEAHIB/AHQAcACAOgJQAOAJAggDQAPAOgBgXIADAAIABACQAUARgLAgQgLANgNgbQgMgXgaAHIAAADIgEAAQAAAMACAMIACAAIAAAGQAFAiAJAgIAAACQAMAGAFANQgzACAbAWQAAAFgDACQgMAJgWAAIgQgBg");
	this.shape_34.setTransform(-11.4693,16.9829);

	this.shape_35 = new cjs.Shape();
	this.shape_35.graphics.f("#E9E4DF").s().p("AByAwQggADgOgJQgOAKgcgCIh/gIQgEgGgHgVIAAADIAAADIgDAAIAAgDQgCgSgQgFIAAgCQgHgFAAgLIADgEIABgCIADAAQAeABgTALIADgBQA+gHBUAIQAHABADgEIAAADQAAANAOgHQAKgDgDgPIAPAiIACABQASgkAfgVQAEgDAKACQAAAAAAAAQABAAAAAAQABAAAAABQABAAAAAAIAAACIgUAHIAAAEIgDAAQgDAGgFADQAEATAAAWIAAADIAOAYQAAAPgFAAQgEAAgFgGg");
	this.shape_35.setTransform(-13.0517,5.1116);

	this.shape_36 = new cjs.Shape();
	this.shape_36.graphics.f("#EC4326").s().p("AgGgBIAAgDIAKAAIADAAIgBADQgFAGgCAAQgDAAgCgGg");
	this.shape_36.setTransform(-19.15,-2.5561);

	this.shape_37 = new cjs.Shape();
	this.shape_37.graphics.f("#E0DFD6").s().p("AgDgGIADAAQADADABAFIAAADIgBACIgCAAQgCAAgCgNg");
	this.shape_37.setTransform(-8,0.6792);

	this.shape_38 = new cjs.Shape();
	this.shape_38.graphics.f("#CD6F6B").s().p("AAAAVQgBgVAAgUIADAAIAAAmIAAADg");
	this.shape_38.setTransform(-8.875,-7.925);

	this.shape_39 = new cjs.Shape();
	this.shape_39.graphics.f("#613618").s().p("AgFAHQAMgRgBACQgDARgFAAIgDgCg");
	this.shape_39.setTransform(-24.4241,-51.0283);

	this.shape_40 = new cjs.Shape();
	this.shape_40.graphics.f("#DED7D1").s().p("ABcBiIAAgDQgDAEgHAAQhUgIg+AHIgDAAQATgLgegBIAAgDQgGgPgPAAIAAgCQgKgHgEgMQAMgbATgTIABgCQgHgDAOAAQArAHARAiIACABQAEAOAJgPIAAgCIAAgDIBsiJIAAAEIgBAAQAAAMgGAEIAAASIAAADIgDAAIAAAVIAAADIAAADIAAADIgEAAQAAAVACAUIACAAQAAAfAHAYIAAADIgEAAQACARAFgDIAAgCQAGgBgCAHIAAADQADAPgKADQgFACgDAAQgGAAAAgIg");
	this.shape_40.setTransform(-18.5839,-6.5025);

	this.shape_41 = new cjs.Shape();
	this.shape_41.graphics.f("#A20806").s().p("AATANQgbgBgVgLQAKgCACgLIACgBQAQAHAPAHIADAAIAHAGIAEABIgBACIgGAAIAAADIgEAAg");
	this.shape_41.setTransform(-17.55,-27.75);

	this.shape_42 = new cjs.Shape();
	this.shape_42.graphics.f("#E7100D").s().p("AAVAWIgVgOIgBgBQgNgMgKgRQAYAWAYAVIABACIgEgBg");
	this.shape_42.setTransform(-17.4,-31.075);

	this.shape_43 = new cjs.Shape();
	this.shape_43.graphics.f("#C08353").s().p("AANAQQgOgIgRgHIgBgBIgDgDIAEgBQADgBgHgLQAJAHAMABIAAgCIAVAOIADABIAAADIgCAAQAAAHgFgBIAAACIgDAAg");
	this.shape_43.setTransform(-17.225,-29.25);

	this.shape_44 = new cjs.Shape();
	this.shape_44.graphics.f("#C7946E").s().p("AAiAZQgdgTgegQIgDAAIgHgGIAAgDQAFABAAgHIACAAIBAAiIAAACIAAAMIAAADIgCgBg");
	this.shape_44.setTransform(-12,-25.925);

	this.shape_45 = new cjs.Shape();
	this.shape_45.graphics.f("#8A1B11").s().p("AgOAbIAGgTQAFgLAHgKIgDgBQgQgJgTgIIAAgDIAHgBIAAgCQAeARAdASIADABQgEAEgEADIgDABQACAdgaACIgEAAQgOAAAEgLg");
	this.shape_45.setTransform(-11.825,-23.1867);

	this.shape_46 = new cjs.Shape();
	this.shape_46.graphics.f("#F48672").s().p("AgBAPIAAgDIAAgaIADAAIAAAaIAAADIgDAAg");
	this.shape_46.setTransform(-26.975,-23.65);

	this.shape_47 = new cjs.Shape();
	this.shape_47.graphics.f("#E92F0A").s().p("AgBARIAAgEIAAgaIAAgCQAFAMgEAUg");
	this.shape_47.setTransform(-26.62,-23.8);

	this.shape_48 = new cjs.Shape();
	this.shape_48.graphics.f("#D83619").s().p("AgkCMQgRgigrgIIgEgCIgEgBQAog5BAgzIgDABQhIASgnglIAAgDIAAgDQAJgBgBgLIgBgDIADAAIACAAQAFgVgHgMIAAADIgDAAIAAgDQAAgLgEgIIAAgDQAigGgMgSIAAgDQAXAEAIgJIAEgBQADAOARgCIADAAIAEAEIAAACIgCABQgCAKgKAEQAVALAbABIAEAAQASAIARAKIADABQgIAKgEAMIgHASQgEANAUgCQAZgBgCgdIADgCQAFgDADgEQAjAIAAAZIAAADIgEAAIAAADIgDABQgRAGgEATIAAgDIhrCJIAAADIgDAAIgLAAIAAADIgCgBg");
	this.shape_48.setTransform(-16.35,-16.825);

	this.shape_49 = new cjs.Shape();
	this.shape_49.graphics.f("#DA7672").s().p("AgKAPQgFgIAAgMQAJgIAPgBIADAAIABADQAMARghAGIAAADIgCAAg");
	this.shape_49.setTransform(-26.6188,-28.8);

	this.shape_50 = new cjs.Shape();
	this.shape_50.graphics.f("#683B1A").s().p("AgFABQAWgIgWAKg");
	this.shape_50.setTransform(-25.875,-48.9451);

	this.shape_51 = new cjs.Shape();
	this.shape_51.graphics.f("#433C3E").s().p("AgGgHQAQANgDABIgFABQgLAAADgPg");
	this.shape_51.setTransform(-13.55,-47.4465);

	this.shape_52 = new cjs.Shape();
	this.shape_52.graphics.f("#070402").s().p("AgLAFQAOgVAIAOQAGAKgVAAQgDAAgEgDg");
	this.shape_52.setTransform(-4.3509,-38.7341);

	this.shape_53 = new cjs.Shape();
	this.shape_53.graphics.f("#61432F").s().p("AgDADQAQgQgQASg");
	this.shape_53.setTransform(-10.325,-46.3945);

	this.shape_54 = new cjs.Shape();
	this.shape_54.graphics.f("#888585").s().p("AgIAFQAEgUAHAOIACAAIADABIABACIgEAAIgCAAQgDAGgDAAQgCAAgDgDg");
	this.shape_54.setTransform(-11.275,-47.7317);

	this.shape_55 = new cjs.Shape();
	this.shape_55.graphics.f("#5C4431").s().p("AgVAVIAAgDIAAgDQAGgRgDgbIAAgDQAGAAgBAJIACAAQABAGAHAOIACABQAJAPAMANIADABIAAACQgNgBgJgHQAHAKgDACIgEAAIgCAAIgDAAQgPAAgCgMg");
	this.shape_55.setTransform(-19.65,-33.0175);

	this.shape_56 = new cjs.Shape();
	this.shape_56.graphics.f("#C12621").s().p("AABAJQABgIgFgBIAAgCIAAgGQAIACgCAMIAAADg");
	this.shape_56.setTransform(-21.1818,-36.375);

	this.shape_57 = new cjs.Shape();
	this.shape_57.graphics.f("#3B312A").s().p("AgQgGQANgFARgBIAEAAIgBADIgDADIAAAGIAAADIgCAAQgEAKgGAAQgHAAgLgTg");
	this.shape_57.setTransform(-16.35,-47.8277);

	this.shape_58 = new cjs.Shape();
	this.shape_58.graphics.f("#623918").s().p("AgQAwQANgyAPgzIACgBIABADIACAAQgRAlgIAvQgDAWgDAAQgBAAgBgHg");
	this.shape_58.setTransform(-19.125,-48.7854);

	this.shape_59 = new cjs.Shape();
	this.shape_59.graphics.f("#633715").s().p("AgGAKQAKgKgGgKIAAgDIACAAIAEADIADAAIAAADQgGAVgDAAQgCAAgCgEg");
	this.shape_59.setTransform(-22.25,-54.9786);

	this.shape_60 = new cjs.Shape();
	this.shape_60.graphics.f("#674827").s().p("AgDAEIgEgCIAAgDQAHABADgDIADAAIACAAQgCAFgGADIgDgBg");
	this.shape_60.setTransform(-21.475,-56.5);

	this.shape_61 = new cjs.Shape();
	this.shape_61.graphics.f("#532E13").s().p("AgPASIgBgDIAAgDIAAgDQAKgSAUgHIAEgBQgQARgNASIgCAAIgCAAg");
	this.shape_61.setTransform(-16,-55.75);

	this.shape_62 = new cjs.Shape();
	this.shape_62.graphics.f("#151212").s().p("AgUADIAAgDIAAgFIADgDIAAgDIAAgDIAHgDIAEAAQAegBgDAQIAAACIgDAAQgHgNgEATQAGAHAFgJIADgBIgBACQgLANgJAAQgLAAgJgPgAAAALQADAAgQgNQgDARAQgEg");
	this.shape_62.setTransform(-12.8325,-47.8894);

	this.shape_63 = new cjs.Shape();
	this.shape_63.graphics.f("#503C2F").s().p("AADAZIgCgBIAAgDQADgQgeABIAAgDQAQAAADgTQACgJANgBQAOgBADANQAJAegWAHQgEABgEADIgBgCg");
	this.shape_63.setTransform(-10.809,-50.2537);

	this.shape_64 = new cjs.Shape();
	this.shape_64.graphics.f("#BC8654").s().p("ACrF2QgOgRgcgEQgHAKgIgDQgKgFgJABQgwAIgTgXIAAgDQABgQgMgDIABgCQAGgggRgIIAAgDQAKgfgiAZIAAADIgCgBQgKgOgMgMIgqAAIAAgCQgbgKgVgPIABAAQg4gwgrg9QgIgYgLgUIgCgEQgLAAgDAaIAAASIAAAEIgDAAIAAAGIAAADQgOgJADARIAAAEQgcgGAEAeIgBACIg3AlIAAADIgCABQgHAKgMgIQgCggADgZQAJhFgKhVQAGgHgCgRIAAgDQANgRAIgWQgOgmgEgvIAAgDIAAgDIAAgbIAAgDIAAgWQAbhUAshFIACgBQAnAmBJgTIADgBQhBA0gnA5IADABIAEACQgOAAAHADIgBADQgTATgMAbQAEAMAKAHIAAACIgDAAIASARIADABIgBADIgDADQAAAMAHAEIAAACIgBAAQABASgKAEQAFANgDAGQgGARAVAAQAMAGgBghIAAgDIADAAIAAAMIAAADQAAANACAOIACAAQABAOAEANIACAAQAMAYgIgeIgBgDIAAgDQAYgWAQAYIACABIAAAVIAAADQAJACADAKIACAAQAGAegEAYQAAAAAAAAQAAABgBAAQAAABAAAAQgBAAAAABQAKAMAVAAQAWASAXAPQAiAFAQgNQADgCAAgFQgbgWAzgCQgFgNgMgGIAAgCQgJgggFgiIAAgGIAAgDIAAgVIAAgDQAagHAMAXQANAbALgNQAKgggTgRIgBgCIACgBQAMg3gYgXIAAgDIAUgHIAAgCQAaANAWACIAAgDQgmh5hIhVIAAgDIADAAQAzAaA8AQIADAAIABAGIADABQAWA0AFBFIABADQAAAMABAMIACAAIADASIAAADIABAbIgBADQAIAdADAgIAAADQAUAXAPAcQBcAjAeBiQACAygTAdIgBACQBCAWBRAJIAAADQAEAZgygHIgDAAIhQgGQAOAeApADIAEAAIgBACQgEAFgNgEIAAgBQgNgDgHAEQAAAHAEAIIADAAIAAAGQAAAfgSgoIgDAAQgbgEgPAWIAAAQIAAADIgDgBIgEgFQAAgGACgGQAGgPgEgEQgagdgNAXIAAAJIAAADIgCAAQgHgNgPgFIABAAQAAgXgFglQANgFABgOQAAgJgBgHQgLgyghAMQAGAigBAqIACAAIgBACIgDABQAIAXAGAbQAAAAABABQAAAAAAAAQABAAAAABQABAAAAAAIABACIgEAAIgDAAQAUAvAjAhIAAACQgDADgCAEQAAAAgBABQAAAAAAAAQgBABAAAAQgBAAAAAAQgCAAgDgDgAAADxQAMANgFgmIAAgEQgDAFgEAYgAgegcQAaBzAOBvQAXgjgBg7QgBgTgFgSQgQg8gogmIAAADg");
	this.shape_64.setTransform(2.1036,17.6763);

	this.shape_65 = new cjs.Shape();
	this.shape_65.graphics.f("#EEA594").s().p("AgOACIgBgEIAbAAIAEAAIgBABIgaABIAAADIgDgBg");
	this.shape_65.setTransform(8.225,-15.175);

	this.shape_66 = new cjs.Shape();
	this.shape_66.graphics.f("#F1735C").s().p("AAAAMQgBgMAAgLIADAAIAAAUIAAADg");
	this.shape_66.setTransform(13.075,-18.5);

	this.shape_67 = new cjs.Shape();
	this.shape_67.graphics.f("#CE1907").s().p("AgrB9IgPgkIAAgCQACgIgGABIAAgDQAAgGgDgDIAAgDQgHgYAAgfIAAgCIAAgnIAAgDIAAgDQAMgNAFAKIACgBIAfgQQAVgKAFAVQAGgTgTgNIAAgBQgiAIgPAOQgCACgFgFIgBAFQgDAMAAgSIAAgDIAAgSQAGgDAAgNIABAAQAEgTARgHIAEgBQBIBVAmB4IAAADQgWgCgbgNQAAAAgBgBQAAAAAAAAQgBAAAAAAQgBgBAAAAQgKgCgEAEQgeAUgSAmIgCgBg");
	this.shape_67.setTransform(-1.375,-6.85);

	this.shape_68 = new cjs.Shape();
	this.shape_68.graphics.f("#C42304").s().p("AgmASIAAgUIADAAQAAARADgMIABgEQAFAEACgCQAPgNAhgIIAAABQAUANgGASQgGgUgVAJIgeAQIgCABQgFgKgMANIAAgDg");
	this.shape_68.setTransform(-4.7794,-12.75);

	this.shape_69 = new cjs.Shape();
	this.shape_69.graphics.f("#B88055").s().p("AgKADIAAgDIAAgFIAKgFIAEgBQAFAIABADIAAADIgCABQgHAIgDAAQgFAAgDgJg");
	this.shape_69.setTransform(-4.15,-24.5746);

	this.shape_70 = new cjs.Shape();
	this.shape_70.graphics.f("#250A08").s().p("AgqABIAAgCQAWgVAMAYIAAACQAcAAAYAGIAAACIgFAAQgxAAgggLg");
	this.shape_70.setTransform(-7.8,-28.6085);

	this.shape_71 = new cjs.Shape();
	this.shape_71.graphics.f("#A86D3B").s().p("AgRAMQAAgEgGgIIAAgCQATgDAOgHIABgCIADAAIADAAQAFADABAJIABAAIAAACQgXAFgRAKIgBgDg");
	this.shape_71.setTransform(-1.375,-25.775);

	this.shape_72 = new cjs.Shape();
	this.shape_72.graphics.f("#EF0504").s().p("AgGAQIgBgCIhBgiIAAgDQAKAEAOgBIAEAAQAhALA1AAIAAgCQAPAAAQACIAAABIgBACQgOAHgUACIAAAEIgDAAIgLAGIAAAGIAAADIgDAAIgJACQgLAAgHgIg");
	this.shape_72.setTransform(-7.625,-26.4242);

	this.shape_73 = new cjs.Shape();
	this.shape_73.graphics.f("#302012").s().p("AAbAEIg6gEIAAgCQAmACAVgFIADAAIAAADQACAIgFAAIgBgCg");
	this.shape_73.setTransform(-2.7233,-29.1);

	this.shape_74 = new cjs.Shape();
	this.shape_74.graphics.f("#A49389").s().p("AgUAGIAAgDQAPgGAPgEIAEgBIAAADQACAGgGgBQABAFAGgBIAEgBIAAACQgIAEgMAAQgJAAgMgDg");
	this.shape_74.setTransform(-4.15,-33.6615);

	this.shape_75 = new cjs.Shape();
	this.shape_75.graphics.f("#18110C").s().p("AgCANIgDAAIgBgBQgPgBgQgBIAAgCQAUABAOgGQABAAAAAAQAAAAAAAAQAAgBAAAAQAAAAAAAAQAFgBgCgIIgBgCIAAgEQATAEAJgDIAEgBIABADQAMAKgUACQgCAHAFAAIAAABIAAACQgOABgOAAIgCAAg");
	this.shape_75.setTransform(0.3117,-28.65);

	this.shape_76 = new cjs.Shape();
	this.shape_76.graphics.f("#4A3A2E").s().p("AglALQgRAAgEgLQApAAAwgJQAYgEAEAPIgDAAQgKADgSgDIAAADIgDAAQgVAEgmgBIAAADIgDAAg");
	this.shape_76.setTransform(-2.425,-30.1744);

	this.shape_77 = new cjs.Shape();
	this.shape_77.graphics.f("#AA9990").s().p("AgNAEIgCgBQgBgEAAgGQAUACANAKIAAACIgDAAIgIABQgIAAgLgEg");
	this.shape_77.setTransform(-0.675,-34.0054);

	this.shape_78 = new cjs.Shape();
	this.shape_78.graphics.f("#CA918B").s().p("AAOACIgeAAIAAgDQAQAAARABIAAACIgDAAg");
	this.shape_78.setTransform(10.825,-28.05);

	this.shape_79 = new cjs.Shape();
	this.shape_79.graphics.f("#E23116").s().p("AgQAwQgPABgGgFQAJgBADgLIACAAIAAhFIAAgGQAjAJAagPIAAADIgVAtIAAAGIAAADIgDAAQAAAMACAMIABAAIAAACQgMANgVADg");
	this.shape_79.setTransform(11.525,-20.475);

	this.shape_80 = new cjs.Shape();
	this.shape_80.graphics.f("#AD1109").s().p("AA8A+IgcAAIgEAAQg8gQgzgaIAAgDQAAgYgjgJIAAgCIAAgMQANALAPgFIAEgBQAFARAOgQIACgBQASgKAYgGIAAgCQAjgLAogHIAEAAIAfAAIADAAQAZAAADAWIAAADQgaAOgkgIIAAAFIAABFIgCABQgDALgJAAQAHAFAOAAIAAABIgDAAg");
	this.shape_80.setTransform(3.5,-21.7);

	this.shape_81 = new cjs.Shape();
	this.shape_81.graphics.f("#B7B0A9").s().p("AgBAOIAAgeIACAAIAAADQADATgFALIAAgDg");
	this.shape_81.setTransform(7.9118,-36.225);

	this.shape_82 = new cjs.Shape();
	this.shape_82.graphics.f("#A28B7C").s().p("AgGADQAHgDADgEIADgBIgBADQgBAIgFAAQgCAAgEgDg");
	this.shape_82.setTransform(5.95,-43.9429);

	this.shape_83 = new cjs.Shape();
	this.shape_83.graphics.f("#55341C").s().p("AACAdIAAgDIgBgDIgJg2QAYAhgLAeg");
	this.shape_83.setTransform(7.8575,-48.925);

	this.shape_84 = new cjs.Shape();
	this.shape_84.graphics.f("#0E0805").s().p("AgEAWQAFABgBgHIAAgDIgBgBQgFgCACgJQAEgYAGgCIgCAGQgCANAAAQQAAAGACAGIACAAIAAADIgEABIgCAAQgEAAAAgEg");
	this.shape_84.setTransform(-2.6141,-35.8827);

	this.shape_85 = new cjs.Shape();
	this.shape_85.graphics.f("#090402").s().p("AgJAHQgEgDAAgFQAPgSgCAXIADgBQAXgGgbAMIgCAAQgDAAgDgCg");
	this.shape_85.setTransform(-0.3364,-38.648);

	this.shape_86 = new cjs.Shape();
	this.shape_86.graphics.f("#584F47").s().p("AgFAGQgIgDgCgJQAUgBAKACIABACIgBACIgGABIgDAAQgEAFgGADIgBgCg");
	this.shape_86.setTransform(5.775,-44.405);

	this.shape_87 = new cjs.Shape();
	this.shape_87.graphics.f("#161311").s().p("AAOAPIgCgEIgBgBQgKgCgUAAIAAgDIAAgIQARgbASAaIADABIAAADIAAACQACAMgGADIgBgCg");
	this.shape_87.setTransform(6.1517,-45.9877);

	this.shape_88 = new cjs.Shape();
	this.shape_88.graphics.f("#B39C8E").s().p("AAHAPQgQgBAAgQQAHgBAAgIIAAgDIACABIAAACIAAAJIAAACQACAKAIADIAAACIgDAAg");
	this.shape_88.setTransform(4.2,-45.15);

	this.shape_89 = new cjs.Shape();
	this.shape_89.graphics.f("#412E21").s().p("AAwBHIAAgCQgNgLgVgCQgBgSADgNIABgGQgGADgEAZQgDAIAGACIAAACIgDAAQgQAFgPAHIAAADIgcgMIAAABQgzALgSgoQAAgnANgaIABgDQAMALAQgFQAaghAlgBQAFAAAEgKQAGgPABARIAAAFQgEAOABAUIgDAAQgRADgPAGQAcgJARARIADABQAZAHAUgBQgVgQgQgVIgBgCIAAgDIAAgcQAOAYAdgGIACgDQANgOABAPIAAADQABAIgIABQABARARABIADAAQALAIADgOIAAgDIAHgBIAAgCIADADIABADQgBAaAGAVIACAAIAAADQACAHgGgBIAAADIAAADIgDAAIAAAfIAAADIgBACQgGAKgLAGIgDAAQgKADgJAAQgPAAgMgJgAAVAQQAAAGADADQAFADADgBQAdgNgXAHIgDABQABgOgFAAQgDAAgHAIgAgRAWQAEADADAAQAVAAgGgLQgDgGgEAAQgGAAgJAOg");
	this.shape_89.setTransform(-3.7733,-40.4113);

	this.shape_90 = new cjs.Shape();
	this.shape_90.graphics.f("#9D8675").s().p("AAAAPQgBgPAAgOIADAAIAAAaIAAADg");
	this.shape_90.setTransform(-2.225,-46.675);

	this.shape_91 = new cjs.Shape();
	this.shape_91.graphics.f("#E8D9CB").s().p("AACBGIgCgBQgSgSgcAJQAPgFARgDIADgBQgCgUAFgNIABgGQAKgjgBgxIAAgDQAKAggDAuIAAADIgEAAQABAPABAPIACAAIABADQAQAUAVARIgFAAQgSAAgWgGg");
	this.shape_91.setTransform(-2.95,-48.7687);

	this.shape_92 = new cjs.Shape();
	this.shape_92.graphics.f("#5A341B").s().p("AgLgtIAAgCQAXAiAAA6IAAADQgJgxgOgsg");
	this.shape_92.setTransform(10.6505,-47.875);

	this.shape_93 = new cjs.Shape();
	this.shape_93.graphics.f("#895C3B").s().p("AB3CjQgFgBACgHQAUgCgMgLIgBgCQgEgQgYAFQgyAJgpgBQAEAMARAAIAEAAIA7AFIAAABQAAABAAAAQAAAAAAAAQAAABAAAAQAAAAgBAAQgOAGgUgCIAAADQgXgGgdAAIgBgCQgKgZgXAVIAAADIgDAAQgPABgKgEIgBgCQgYgVgYgWIgCgBQgHgOgBgGIAAgDQACgOgJgCQAIgmgZAUIgDgBQg9gygehRQAngdA6gKIAEAAIAAACQAHAMgLAKQAHAMAHgeIAAgDQAHgDACgGIgCAAIAAgDQAQgJASgIIABgCIAxAHQA4glBAAfQATAJANAPQAygFAUAaQAPAjAhARIAEACQAGBAgYBAQgBAFABAGQgmgVAChIQAAgJgJADQgGAUACAeIABAGIgCAAQgGgWABgZQAFgEgCgLIAAgDIAEADQAKgegYgiIAKA3IAAADIgCgBQgTgagRAbIgBgDIgDAAQgBgPgNAOIgCADQgdAGgOgYIAAgDQAEgugLggIAAADQABAxgLAkQgCgRgGAPQgEAKgFAAQgkABgaAgQgQAFgMgLIgBADQgNAaAAAoQASAoAzgLIAAgBIAbAMQAbAGAPgHIAAgCIAAgDQARAHALgEIADAAQASAPAcgJIADAAIAAADQAIAugkACgAC3hTQAPArAIAyIAAgDQABg6gZgjIABADgAg5iGQgVAIgLATIAAADIAAADIgCAAQgPAzgOAzQADASAGghQAIgwASgkIACgBQAOgSAPgRIgDAAgAgTgTIAAABIAJgKIgJAJgAgUggIABgCIAEAAQADgDAEgCQAWgGgKggQgCgMgOABQgNABgCAIQgEAUgQAAIAAADIgDABIgHACIAAADIgEAAQgRABgOAFQATAhAKgXIACAAQASAcAXgagAiwgvIAAACIAMgGIgMAEgAiig+QAJAHAEgXIAAAAIgNAQg");
	this.shape_93.setTransform(-8.7807,-44.0243);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_93},{t:this.shape_92},{t:this.shape_91},{t:this.shape_90},{t:this.shape_89},{t:this.shape_88},{t:this.shape_87},{t:this.shape_86},{t:this.shape_85},{t:this.shape_84},{t:this.shape_83},{t:this.shape_82},{t:this.shape_81},{t:this.shape_80},{t:this.shape_79},{t:this.shape_78},{t:this.shape_77},{t:this.shape_76},{t:this.shape_75},{t:this.shape_74},{t:this.shape_73},{t:this.shape_72},{t:this.shape_71},{t:this.shape_70},{t:this.shape_69},{t:this.shape_68},{t:this.shape_67},{t:this.shape_66},{t:this.shape_65},{t:this.shape_64},{t:this.shape_63},{t:this.shape_62},{t:this.shape_61},{t:this.shape_60},{t:this.shape_59},{t:this.shape_58},{t:this.shape_57},{t:this.shape_56},{t:this.shape_55},{t:this.shape_54},{t:this.shape_53},{t:this.shape_52},{t:this.shape_51},{t:this.shape_50},{t:this.shape_49},{t:this.shape_48},{t:this.shape_47},{t:this.shape_46},{t:this.shape_45},{t:this.shape_44},{t:this.shape_43},{t:this.shape_42},{t:this.shape_41},{t:this.shape_40},{t:this.shape_39},{t:this.shape_38},{t:this.shape_37},{t:this.shape_36},{t:this.shape_35},{t:this.shape_34},{t:this.shape_33},{t:this.shape_32},{t:this.shape_31},{t:this.shape_30},{t:this.shape_29},{t:this.shape_28},{t:this.shape_27},{t:this.shape_26},{t:this.shape_25},{t:this.shape_24},{t:this.shape_23},{t:this.shape_22},{t:this.shape_21},{t:this.shape_20},{t:this.shape_19},{t:this.shape_18},{t:this.shape_17},{t:this.shape_16},{t:this.shape_15},{t:this.shape_14},{t:this.shape_13},{t:this.shape_12},{t:this.shape_11},{t:this.shape_10},{t:this.shape_9},{t:this.shape_8},{t:this.shape_7},{t:this.shape_6},{t:this.shape_5},{t:this.shape_4},{t:this.shape_3},{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-44.9,-60.4,89.9,120.9);


(lib.Tween23 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_62();
	this.instance.setTransform(-45.3,-60.45,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-45.3,-60.4,90.5,121);


(lib.Tween22 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_61();
	this.instance.setTransform(-45.3,-60.45,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-45.3,-60.4,90.5,121);


(lib.Tween21 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#DAD3C5").s().p("AgjBtQAAgFgBAAQhlgXgmhRQgIg+AQgmIABgEIABgGQAugIAzADQAugCAzAHIAKAAQAIATgRBRIgBAKQApAUAfAIIADgBIAAABQAgAHAXgIIAKgFIABgBQAEgCAFAAIAAADIgBAHQgBAZgIASQgEAJgGAHQgTAXgkAEIAAgbQgSAVgiAGQgMACgPAAQgaAAgigIg");
	this.shape.setTransform(-60.1197,93.5983);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#8A858F").s().p("ABdCjIgKAAIgKAAIg3AAIhLAAIg3AAIAAgKIA3AAIBLADIAAgCIA3ACIAKAAIAKAAIAJABIAAAGIgJAAgABmihIAKAAIAAAEIgKABg");
	this.shape_1.setTransform(-51.5,98.25);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#867C7A").s().p("AgEAtIAAhjQAQAqgMBCQAAABgEAAIAAgKg");
	this.shape_2.setTransform(-6.7396,73.5);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#FBF9F5").s().p("AA3A8IhZAAIAAgKQADhIghglQBmAHAUBbQACALAFAKIgKAAg");
	this.shape_3.setTransform(25.25,115);

	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f("#AAA191").s().p("AASAJQAJgNhEgNQB1gKgvAmQgMAJgDAAQgDAAAHgLg");
	this.shape_4.setTransform(18.9694,105.8447);

	this.shape_5 = new cjs.Shape();
	this.shape_5.graphics.f("#ABA291").s().p("AgsgJQBagHgBAPQAAABgSAGQgTAGgOAAQgbAAgLgVg");
	this.shape_5.setTransform(9.2512,107.0109);

	this.shape_6 = new cjs.Shape();
	this.shape_6.graphics.f("#FBFAF6").s().p("AAhEEQgVAAAAgBQgMithNiHQAAgFgCgEQgHgLgBgUQAjhLAUheQABgBAFAAQBFESAtDrIgPADQgFACgFAFIgeAAg");
	this.shape_6.setTransform(58.5,72);

	this.shape_7 = new cjs.Shape();
	this.shape_7.graphics.f("#AEA28F").s().p("AiVC0IgBgKQgNg2gGhgQBPhgAtiEQABgBAFAAQBMCHANCsQAAACAUAAIAeAAQAFAAAEABQA0ARAJA0QAAATgLADQhTAShGAAQhYAAhDgeg");
	this.shape_7.setTransform(54.75,88.0188);

	this.shape_8 = new cjs.Shape();
	this.shape_8.graphics.f("#868082").s().p("AgEAoIAAhZQAQAmgMA8QAAABgEAAIAAgKg");
	this.shape_8.setTransform(18.2604,4);

	this.shape_9 = new cjs.Shape();
	this.shape_9.graphics.f("#6E686A").s().p("AgVAwQgegYAIg+QAughApBAQACAEAAAEQgFAAgEACQglAagNAWQgFAAgDgDg");
	this.shape_9.setTransform(31.1658,-14.0585);

	this.shape_10 = new cjs.Shape();
	this.shape_10.graphics.f("#968F8B").s().p("AgjARQANgVAmgaQADgCAFAAQAFAAABABQARBAgjAAQgQAAgfgQg");
	this.shape_10.setTransform(33.3041,-10.6833);

	this.shape_11 = new cjs.Shape();
	this.shape_11.graphics.f("#928C89").s().p("AgngYQAQACgBgWIAFAAQAQAsAhAOQAFABAFAAQAAAFgDADQgUAWgQAAQgbAAgNhFg");
	this.shape_11.setTransform(60.75,-10.5158);

	this.shape_12 = new cjs.Shape();
	this.shape_12.graphics.f("#484444").s().p("AAMAfQgTgUgNgbIAAgKQAvgZgHBKIgBAKQgFAAgCgCg");
	this.shape_12.setTransform(62.8257,-16.3219);

	this.shape_13 = new cjs.Shape();
	this.shape_13.graphics.f("#635E62").s().p("AAUAsQghgOgQgsIAAgKIAAgKQAFgFAGgDQAEgCAFAAQALAcAVASQACADAFAAIAAAeIAAAKQgFAAgFgBg");
	this.shape_13.setTransform(61.75,-13.5);

	this.shape_14 = new cjs.Shape();
	this.shape_14.graphics.f("#413F43").s().p("AgdgOQBrgHhSAiQgIADgFAAQgRAAAFgeg");
	this.shape_14.setTransform(35.7283,-77.4833);

	this.shape_15 = new cjs.Shape();
	this.shape_15.graphics.f("#2D2430").s().p("Ag7gkQA8g7AhAvQABACAFAAQAGA1ANAvQABAEAAAFIAAAFIgBAAQgNACgLAAQhPAAgPhqg");
	this.shape_15.setTransform(61.75,-31.3027);

	this.shape_16 = new cjs.Shape();
	this.shape_16.graphics.f("#6C6259").s().p("AhjgwQAtBsCFgiQABAAAAgFIAKAAIAKAAQAAAFgCABQgyAWgmAAQhQAAgdhhg");
	this.shape_16.setTransform(50.75,-50.0767);

	this.shape_17 = new cjs.Shape();
	this.shape_17.graphics.f("#180E0F").s().p("AAFAeIgJAAIgKAAQgjgFAFgsIAAgKQAwAdApgEIAAAEQAAAFgCACQgNANgPAKIgKAAg");
	this.shape_17.setTransform(59.2188,-51);

	this.shape_18 = new cjs.Shape();
	this.shape_18.graphics.f("#3D3139").s().p("AApAjQgpAFgwgeIAAAKQgFAAgDgCQgCgDAAgFIAAgKIAAgTQAYgUAtAAIAKAAQA8ASgiA7QgBACgFAAg");
	this.shape_18.setTransform(59.6649,-55.0006);

	this.shape_19 = new cjs.Shape();
	this.shape_19.graphics.f("#98AAB0").s().p("AgWgEIAKAAQATATAIgTQACgFAAgFQAFAAAAABQAFAcgOAAQgMAAgXgTg");
	this.shape_19.setTransform(60.0583,-68.5268);

	this.shape_20 = new cjs.Shape();
	this.shape_20.graphics.f("#172326").s().p("AgOALIAAgKIAAgTQAagHACARIABAJQAAAFgCAFQgEAKgHAAQgGAAgKgKg");
	this.shape_20.setTransform(60.25,-70.1208);

	this.shape_21 = new cjs.Shape();
	this.shape_21.graphics.f("#A1A0AB").s().p("AgFAjIAAhPIAJAAIAAAKQAHA0gQAbIAAgKg");
	this.shape_21.setTransform(8.375,-47.5);

	this.shape_22 = new cjs.Shape();
	this.shape_22.graphics.f("#DAD6CD").s().p("AgTgJIAKAAIAJAAQAKAAAIAEQACABAAAEQAAAFgBAAQgOAFgHAAQgSAAABgTg");
	this.shape_22.setTransform(29.7488,-64.9667);

	this.shape_23 = new cjs.Shape();
	this.shape_23.graphics.f("#151B23").s().p("AgOADIAAgJIAAgKQAagHACARIABAJQAAAFgCADQgHAIgGAAQgHAAgHgQg");
	this.shape_23.setTransform(35.25,-69.346);

	this.shape_24 = new cjs.Shape();
	this.shape_24.graphics.f("#9BAAB1").s().p("AgWgOIAKAAQAMAYAPgQQACgDABgFIAEAAQgKAdgLAAQgKAAgNgdg");
	this.shape_24.setTransform(35,-67.4875);

	this.shape_25 = new cjs.Shape();
	this.shape_25.graphics.f("#555758").s().p("AgXAhQAAgFgCgBQgIgEgKAAIAAgFQgdAAAJgiQBOg8AsBEQACACAFAAIAAAJQAEAqgoAAQgVAAgggMgAAfgGIgFAAIgBgKQgCgRgaAHIAAAKIAAAKIgKAAQAYA8AUg8g");
	this.shape_25.setTransform(34.186,-68.3231);

	this.shape_26 = new cjs.Shape();
	this.shape_26.graphics.f("#8C8587").s().p("AAAAnQgEgnAAgnIAJAAIAABFIAAAKIgFgBg");
	this.shape_26.setTransform(14.25,-92);

	this.shape_27 = new cjs.Shape();
	this.shape_27.graphics.f("#99979E").s().p("AgFAoIAAhZIAJAAIAAAKQAHA5gQAgIAAgKg");
	this.shape_27.setTransform(7.375,-86);

	this.shape_28 = new cjs.Shape();
	this.shape_28.graphics.f("#D2C8BC").s().p("AhAB0IAAgKIAAhGIAAgKIAAgnQAQgnAJgyQAAgBAFAAQAMAWAtgjQACgCAAgFQAFAAAAABIAjCoQAAAFgCAFQgWBEg9AAQgUAAgYgIg");
	this.shape_28.setTransform(21.25,-99.6451);

	this.shape_29 = new cjs.Shape();
	this.shape_29.graphics.f("#E9E7E7").s().p("AgdAcIAAgKIAAgTQAghEAaBEQABAEAAAFQAAAFgCACQgcAVgPAAQgJAAgFgIg");
	this.shape_29.setTransform(20.75,-112.7692);

	this.shape_30 = new cjs.Shape();
	this.shape_30.graphics.f("#60615F").s().p("Ag2gcQAugXAsAVQAEACAFAAQAQARgIAKQglAqgYAAQggAAgOhFgAAAgHQAAgBgEAAIgBgKQgCgRgbAHIAAAUIAAAJIgKAAQA0ArgIgzg");
	this.shape_30.setTransform(62.2945,-69.1102);

	this.shape_31 = new cjs.Shape();
	this.shape_31.graphics.f("#524E55").s().p("AgagMQBmgLhXAlIgHABQgMAAAEgbg");
	this.shape_31.setTransform(58.4482,-78.6827);

	this.shape_32 = new cjs.Shape();
	this.shape_32.graphics.f("#ADABAD").s().p("AgEAeIAAhFQAQAbgMAzQAAABgEAAIAAgKg");
	this.shape_32.setTransform(69.2691,-95);

	this.shape_33 = new cjs.Shape();
	this.shape_33.graphics.f("#EAE8E2").s().p("AgdDGQg9iHghh6QAAgFgBgFQgQg0AHhOQBBBGAjAyIAAgUQCAgNAoB7QABAEAAAFIgBAKQgCAHgbgRQgFAAgEgCQgtgUguAWQgFAAgBACQgLALgWgXQATBbBEArQACABAAAFIgKAAQgtAAgYAUIAAAUIAAAKQgFAAgBgCgAgDg7QgFAjATgIQBEgdgvAAQgNAAgWACg");
	this.shape_33.setTransform(56.1303,-74);

	this.shape_34 = new cjs.Shape();
	this.shape_34.graphics.f("#E1DCD6").s().p("ABRBCQgEgCgFAAQgFAAgCgCQgshDhOA7QgFAAgEgCQgbgMgOgaIAAgKQBLhzB6BGQACABAAAFQAAAFACACQAmAhg8AJQAbA2gMAAIgGgCgAgHgjQgHApAfgNQBEgdg/AAIgdABg");
	this.shape_34.setTransform(33.5962,-75.4157);

	this.shape_35 = new cjs.Shape();
	this.shape_35.graphics.f("#7D7C84").s().p("AhZAJIAAgJQBhAHBIgQIAKgBQAAAFgBABQg5APhHAAQgYAAgagCg");
	this.shape_35.setTransform(41.75,-104.9047);

	this.shape_36 = new cjs.Shape();
	this.shape_36.graphics.f("#CFC7BA").s().p("AABBXQgsgxgQhOQARgXgCgvIAFAAQAdAoAngFIABgFQAYAkABA/IAFAAQAFBcgbAAQgOAAgXgYg");
	this.shape_36.setTransform(61.7978,-100.8661);

	this.shape_37 = new cjs.Shape();
	this.shape_37.graphics.f("#636363").s().p("AAZBfQgBhAgYgjQAAgFgBgEQgPgngXggQAFAAADgCQACgDAAgFQAxBBATBeIABAKIgKAAIAAAKIAAAKg");
	this.shape_37.setTransform(64.75,-108.5);

	this.shape_38 = new cjs.Shape();
	this.shape_38.graphics.f("#EBE8E7").s().p("AgiAHIAAgJIAAgKQAPgKAJgSQABgCAFAAQAWAgAPAmQACAEAAAFIgBAFIgJABQghAAgagkg");
	this.shape_38.setTransform(61.25,-112.7171);

	this.shape_39 = new cjs.Shape();
	this.shape_39.graphics.f("#D6CFBF").s().p("ACMPtIhaAAQgFgKgCgLQgUhchmgHQAhAlgDBJIAAAKIgKAAIiMAAQiFgLiJAGQipAJgVh8QAxAaA9ANIAKABQCzhWAUj0IABgKQAFAAAAgBQAMhDgRgqIgBgKQgJhZgog9QBeApApBhQAAACAFAAQBUhgAyiEQABgCAFAAQgBiwAUiZIABgKQAFAAAAgBQAMg9gRgmIgBgKQgOiaA3hWQAFAAAFABQCOApAvhSQAFgFACgGQADgOgGgCQithJiChuQAsh5A8hrQABgCAFAAQAOAaAaAMQAEACAFAAQgJAiAdABIAAAFIgKAAIgKAAQgBAfAogQQABAAAAgFQBgAjgFhBIgBgKQAFAAAEACQAYANghhBQA8gJgmgiQgCgCAAgFQAFAAADgCQACgDAAgFQAgB7A+CHQABACAFAAQAAAFACADQADACAFAAQgFAtAjAFIAKAAQAAAFgBAAQiGAigthtQArCRCbhFQACgBAAgFQAPgKANgNQACgCAAgFQAFAAABgCQAig8g8gSQAAgFgCgBQhFgrgThbQAVAXAMgLQACgCAFAAQAaB9BShiQAJgKgRgRQAbARACgHIABgKQAkBPAYAkIAAgFIAFAAQgWB6hdBEQAIAWABAcIABAKQgFAAgBgCQghgwg9A8QASB7BlgSIABAAQgHAvAEBiQAXJFCMIuQAAAFABAAQBQAOAJBRQAAAFgCAAQh3ArhFhOIAFAAQiEgSijAIIACAoIACAfQAEAqgdgpQAHAQgOAPQgCACAAAFIgKAAgAEdEAQgUBegjBLQAAAUAIALQACAEAAAFQgFAAgBACQgtCDhPBhQAGBhANA2IABAJQB4A2C9gqQALgDAAgTQgJg0g0gRQgEgBgFAAQAFgFAGgCIAOgDQgtjrhGkTQgFAAAAABgAjbNXQARAiA3gSQASgGAAgCQABgKgrAAQgUAAgcACgAh3NDQBFANgIAOQgPAXAZgVQAmgfhFAAQgRAAgXACgAF5keQADgDAAgFIAAgKIAAgeIAAgKQAIhMgwAaIAAAKQgFAAgEACQgGADgFAFIAAAKIAAAKIgFAAQABAVgQgBQAVBtA4g9gAAAmAQgHA/AdAZQADACAFAAQBbAxgZhiQgBgBgFAAQAAgFgCgEQgbgqgeAAQgPAAgQALg");
	this.shape_39.setTransform(26.75,20.5);

	this.shape_40 = new cjs.Shape();
	this.shape_40.graphics.f("#28212F").s().p("AlRSWIgJAAIgKgBIg3gCIAAACIhMgCIg3gBIgKAAQjHgUhaiCQAYgUAAgoQgCg+AmgcQAugBA2gOIAAAFIgBAGIgBAEQgQAmAIA+QAlBSBlAXQABAAAAAFQA2AMAjgGQAhgGATgVIAAAbQAkgEATgXQAGgHAEgJQAHgSACgZIAAgHIAAgDQAFgRAFgQIAAhgIAKgBIAAgFIAAgKQAvjLCNhuQACgCAAgFQB0mZCRl1QAYg9AFhMQARgbgHg1IAAgKQAAgFgDgCQg2g5gDhqQASg4AUg2QABgFAAgFQASgggHg6IAAgKIAAgKIAAhQQAeiGBbhJQAEgDAFAAQA0BNAxBXQADAGAPAAQBnAIBMgWQABgBAAgFQAZhfBPgnQANgHgGAVQAAAFgDADQgCACgGAAQgEAAgBACQgKASgPAKIAAAKIAAAKIgEAAQACAwgRAWQAQBPAtAxQBDBJgJiNIAAgKIAAgKIAKAAIAAAKIAAAKIAABGIAAAKIABAKQAGAbgRADQA3BvAYCLIABAKIAAAFQgXgkglhPQAAgFgBgEQgoh8iAANIgBAUQgjgyhBhGQgHBOAQA1QACAEAAAFQAAAFgDADQgCACgGAAQAAgFgCgBQh6hGhMB0IAAAKQgEAAgBACQg9BrgrB5QCCBuCuBJQAGACgEAOQgCAGgFAFQgvBTiPgpQgFgCgFAAQg2BWAOCZIABAKIAABaIAAAKIgBAKQgUCaAACwQgFAAAAACQgyCEhUBgQgFAAgBgCQgphhhdgpQAnA9AKBZIABAKIAABkIAAAKIgBAKQgTD0izBWIgKgBQg9gNgygaQAAgFgCgDQgKgSgIgUIAABgIgKgBgADktMIAEAAQBkAdAdhZQABgFABgFIgjipQAAgBgGAAQAAgFgBgEQgahFggBEIAAAUIAAAKQgGAAAAABQgIAygRAnIAAAoIAAAKIgKAAQAAAoAGAog");
	this.shape_40.setTransform(-8.5,-3.525);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_40},{t:this.shape_39},{t:this.shape_38},{t:this.shape_37},{t:this.shape_36},{t:this.shape_35},{t:this.shape_34},{t:this.shape_33},{t:this.shape_32},{t:this.shape_31},{t:this.shape_30},{t:this.shape_29},{t:this.shape_28},{t:this.shape_27},{t:this.shape_26},{t:this.shape_25},{t:this.shape_24},{t:this.shape_23},{t:this.shape_22},{t:this.shape_21},{t:this.shape_20},{t:this.shape_19},{t:this.shape_18},{t:this.shape_17},{t:this.shape_16},{t:this.shape_15},{t:this.shape_14},{t:this.shape_13},{t:this.shape_12},{t:this.shape_11},{t:this.shape_10},{t:this.shape_9},{t:this.shape_8},{t:this.shape_7},{t:this.shape_6},{t:this.shape_5},{t:this.shape_4},{t:this.shape_3},{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-92.7,-121,185.5,242);


(lib.Tween19 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#867C7A").s().p("AgEAtIAAhjQAQArgMBBQAAABgEAAIAAgKg");
	this.shape.setTransform(-9.4896,73.5);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#8A858F").s().p("AhUgEICVAAIAKAAIAKAAIAAAEIgUABQhKAEhLAAIAAgJg");
	this.shape_1.setTransform(-51.5,82.5);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#DAD3C5").s().p("AiKBvQAAgFgBgEQgQgmAHg/QAmhRBlgXQABAAAAgFQCZgiAGByIAAAIIAAACQgFAAgDgCQgtgchhAxIABAKQASBRgJATIgKABQgjAFgjAAQgkAAghgGg");
	this.shape_2.setTransform(-60.1197,102.8909);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#ABA291").s().p("AgsgJQBagHgBAPQAAABgSAGQgTAGgOAAQgbAAgLgVg");
	this.shape_3.setTransform(6.5012,107.0109);

	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f("#AAA191").s().p("AASAJQAJgNhEgNQB1gKgvAmQgMAJgDAAQgDAAAHgLg");
	this.shape_4.setTransform(16.2194,105.8447);

	this.shape_5 = new cjs.Shape();
	this.shape_5.graphics.f("#FBF9F5").s().p("AA3A8IhZAAIAAgKQADhIghglQBmAHAUBcQACAKAFAKIgKAAg");
	this.shape_5.setTransform(22.5,115);

	this.shape_6 = new cjs.Shape();
	this.shape_6.graphics.f("#AEA28F").s().p("AiVC0IgBgKQgNg2gGhgQBPhgAtiEQABgBAFAAQBMCHANCsQAAACAUAAIAeAAQAFAAAEABQA0ARAJA0QAAATgLADQhTAShGAAQhYAAhDgeg");
	this.shape_6.setTransform(52,88.0188);

	this.shape_7 = new cjs.Shape();
	this.shape_7.graphics.f("#868082").s().p("AgEAoIAAhZQAQAlgMA9QAAABgEAAIAAgKg");
	this.shape_7.setTransform(15.5104,4);

	this.shape_8 = new cjs.Shape();
	this.shape_8.graphics.f("#FBFAF6").s().p("AAhEEQgVAAAAgCQgMithNiGQAAgFgCgDQgHgNgBgTQAjhMAUhdQABgBAFAAQBFERAtDsIgPAEQgFABgFAFIgeAAg");
	this.shape_8.setTransform(55.75,72);

	this.shape_9 = new cjs.Shape();
	this.shape_9.graphics.f("#484444").s().p("AAMAfQgTgUgNgbIAAgKQAvgZgHBKIgBAKQgFAAgCgCg");
	this.shape_9.setTransform(60.0757,-16.3219);

	this.shape_10 = new cjs.Shape();
	this.shape_10.graphics.f("#928C89").s().p("AgngYQAQACgBgWIAFAAQAQAsAhAOQAFABAFAAQAAAFgDADQgUAWgQAAQgbAAgNhFg");
	this.shape_10.setTransform(58,-10.5158);

	this.shape_11 = new cjs.Shape();
	this.shape_11.graphics.f("#635E62").s().p("AAUArQghgNgQgsIAAgKIAAgKQAFgFAGgDQAEgCAFAAQALAbAVAUQACACAFAAIAAAeIAAAKQgFAAgFgCg");
	this.shape_11.setTransform(59,-13.5);

	this.shape_12 = new cjs.Shape();
	this.shape_12.graphics.f("#6C6259").s().p("AhjgwQAtBsCFgiQABAAAAgFIAKAAIAKAAQAAAFgCABQgyAWgmAAQhQAAgdhhg");
	this.shape_12.setTransform(48,-50.0767);

	this.shape_13 = new cjs.Shape();
	this.shape_13.graphics.f("#2D2430").s().p("Ag7gkQA8g7AhAvQABACAFAAQAGA1ANAvQABAEAAAFIAAAFIgBAAQgNACgLAAQhPAAgPhqg");
	this.shape_13.setTransform(59,-31.3027);

	this.shape_14 = new cjs.Shape();
	this.shape_14.graphics.f("#968F8B").s().p("AgjARQANgVAmgaQADgCAFAAQAFAAABABQARBAgjAAQgQAAgfgQg");
	this.shape_14.setTransform(30.5541,-10.6833);

	this.shape_15 = new cjs.Shape();
	this.shape_15.graphics.f("#6E686A").s().p("AgVAwQgegYAIg+QAughApBAQACAEAAAEQgFAAgEACQglAagNAWQgFAAgDgDg");
	this.shape_15.setTransform(28.4158,-14.0585);

	this.shape_16 = new cjs.Shape();
	this.shape_16.graphics.f("#DAD6CD").s().p("AgTgJIAKAAIAJAAQAKAAAIAEQACABAAAEQAAAFgBAAQgOAFgHAAQgSAAABgTg");
	this.shape_16.setTransform(26.9988,-64.9667);

	this.shape_17 = new cjs.Shape();
	this.shape_17.graphics.f("#9BAAB1").s().p("AgWgOIAKAAQAMAYAPgQQACgDABgFIAEAAQgKAdgLAAQgKAAgNgdg");
	this.shape_17.setTransform(32.25,-67.4875);

	this.shape_18 = new cjs.Shape();
	this.shape_18.graphics.f("#151B23").s().p("AgOADIAAgJIAAgKQAagHACARIABAJQAAAFgCADQgHAIgGAAQgHAAgHgQg");
	this.shape_18.setTransform(32.5,-69.346);

	this.shape_19 = new cjs.Shape();
	this.shape_19.graphics.f("#555758").s().p("AgXAhQAAgFgCgBQgIgEgKAAIAAgFQgdAAAJgiQBOg8AsBEQACACAFAAIAAAJQAEAqgoAAQgVAAgggMgAAfgGIgFAAIgBgKQgCgRgaAHIAAAKIAAAKIgKAAQAYA8AUg8g");
	this.shape_19.setTransform(31.436,-68.3231);

	this.shape_20 = new cjs.Shape();
	this.shape_20.graphics.f("#A1A0AB").s().p("AgFAjIAAhPIAJAAIAAAKQAHAzgQAcIAAgKg");
	this.shape_20.setTransform(5.625,-47.5);

	this.shape_21 = new cjs.Shape();
	this.shape_21.graphics.f("#99979E").s().p("AgFAoIAAhZIAJAAIAAAKQAHA5gQAgIAAgKg");
	this.shape_21.setTransform(4.625,-86);

	this.shape_22 = new cjs.Shape();
	this.shape_22.graphics.f("#8C8587").s().p("AAAAoQgEgoAAgnIAJAAIAABFIAAAKIgFAAg");
	this.shape_22.setTransform(11.5,-92);

	this.shape_23 = new cjs.Shape();
	this.shape_23.graphics.f("#413F43").s().p("AgdgOQBrgHhSAiQgIADgFAAQgRAAAFgeg");
	this.shape_23.setTransform(32.9783,-77.4833);

	this.shape_24 = new cjs.Shape();
	this.shape_24.graphics.f("#E1DCD6").s().p("ABRBCQgEgCgFAAQgFAAgCgCQgshDhOA7QgFAAgEgCQgbgMgOgaIAAgKQBLhzB6BGQACABAAAFQAAAFACACQAmAhg8AJQAbA2gMAAIgGgCgAgHgjQgHApAfgNQBEgdg/AAIgdABg");
	this.shape_24.setTransform(30.8462,-75.4157);

	this.shape_25 = new cjs.Shape();
	this.shape_25.graphics.f("#180E0F").s().p("AAFAeIgJAAIgKgBQgjgEAFgsIAAgKQAwAdApgEIAAAEQAAAFgCADQgNAMgPAKIgKAAg");
	this.shape_25.setTransform(56.4688,-51);

	this.shape_26 = new cjs.Shape();
	this.shape_26.graphics.f("#3D3139").s().p("AApAjQgpAFgwgeIAAAKQgFAAgDgCQgCgDAAgFIAAgKIAAgTQAYgUAtAAIAKAAQA8ASgiA7QgBACgFAAg");
	this.shape_26.setTransform(56.9149,-55.0006);

	this.shape_27 = new cjs.Shape();
	this.shape_27.graphics.f("#98AAB0").s().p("AgWgEIAKAAQATATAIgTQACgFAAgFQAFAAAAABQAFAcgOAAQgMAAgXgTg");
	this.shape_27.setTransform(57.3083,-68.5268);

	this.shape_28 = new cjs.Shape();
	this.shape_28.graphics.f("#172326").s().p("AgOALIAAgKIAAgTQAagHADARIAAAJQAAAFgCAFQgEAKgHAAQgGAAgKgKg");
	this.shape_28.setTransform(57.5,-70.1208);

	this.shape_29 = new cjs.Shape();
	this.shape_29.graphics.f("#60615F").s().p("Ag2gcQAugXAsAVQAEACAFAAQAQARgIAKQglAqgYAAQggAAgOhFgAAAgHQAAgBgEAAIgBgKQgCgRgbAHIAAAUIAAAJIgKAAQA0ArgIgzg");
	this.shape_29.setTransform(59.5445,-69.1102);

	this.shape_30 = new cjs.Shape();
	this.shape_30.graphics.f("#524E55").s().p("AgagMQBmgLhXAlIgHABQgMAAAEgbg");
	this.shape_30.setTransform(55.6982,-78.6827);

	this.shape_31 = new cjs.Shape();
	this.shape_31.graphics.f("#D6CFBF").s().p("ACMPtIhaAAQgFgKgCgKQgUhdhmgHQAhAlgDBJIAAAKIgKAAIiMAAQiFgLiJAGQipAJgVh8QAxAaA9ANIAKABQCzhWAUj0IABgKQAFAAAAgBQAMhCgRgrIgBgKQgJhZgog9QBeApApBhQAAACAFAAQBUhgAyiFQABgBAFAAQgBiwAUiZIABgKQAFAAAAgBQAMg+gRglIgBgKQgOibA3hVQAFAAAFACQCOApAvhTQAFgFACgGQADgOgGgCQithJiChuQAsh5A8hrQABgCAFAAQAOAaAaAMQAEACAFAAQgJAjAdAAIAAAFIgKAAIgKAAQgBAfAogPQABgBAAgFQBgAigFhAIgBgKQAFAAAEACQAYAMghhAQA8gKgmghQgCgCAAgFQAFAAADgDQACgCAAgFQAgB7A+CHQABACAFAAQAAAFACACQADADAFAAQgFAtAjAEIAKABQAAAFgBABQiGAhgthtQArCRCbhFQACgBAAgFQAPgKANgMQACgDAAgFQAFAAABgCQAig8g8gSQAAgFgCgCQhFgqgThbQAVAXAMgKQACgDAFAAQAaB9BShiQAJgKgRgRQAbARACgHIABgKQAkBPAYAkIAAgFIAFAAQgWB5hdBFQAIAWABAcIABAKQgFAAgBgDQghgug9A7QASB6BlgRIABAAQgHAvAEBiQAXJFCMIuQAAAFABAAQBQAOAJBRQAAAFgCABQh3AqhFhOIAFAAQiEgRijAHIACAoIACAgQAEApgdgoQAHAPgOAOQgCADAAAFIgKAAgAEdEAQgUBdgjBMQAAATAIANQACADAAAFQgFAAgBABQgtCFhPBgQAGBgANA2IABAKQB4A2C9gqQALgDAAgTQgJgzg0gRQgEgCgFAAQAFgFAGgBIAOgEQgtjshGkSQgFAAAAABgAjbNXQARAiA3gSQASgGAAgCQABgKgrAAQgUAAgcACgAh3NDQBFANgIAOQgPAWAZgUQAmgfhFAAQgRAAgXACgAF5kfQADgCAAgFIAAgKIAAgeIAAgKQAIhLgwAZIAAAKQgFAAgEACQgGADgFAFIAAAKIAAAKIgFAAQABAWgQgCQAVBtA4g+gAAAmAQgHA/AdAYQADADAFAAQBbAxgZhiQgBgBgFAAQAAgFgCgEQgbgqgeAAQgPAAgQALg");
	this.shape_31.setTransform(24,20.5);

	this.shape_32 = new cjs.Shape();
	this.shape_32.graphics.f("#EAE8E2").s().p("AgdDGQg9iHghh6QAAgFgBgEQgQg2AHhNQBBBGAjAxIAAgTQCAgNAoB6QABAFAAAFIgBAKQgCAHgbgRQgFAAgEgCQgtgVguAXQgFAAgBADQgLAKgWgXQATBbBEAqQACACAAAFIgKAAQgtgBgYAVIAAAUIAAAKQgFAAgBgCgAgDg7QgFAkATgJQBEgdgvAAQgNAAgWACg");
	this.shape_32.setTransform(53.3803,-74);

	this.shape_33 = new cjs.Shape();
	this.shape_33.graphics.f("#ADABAD").s().p("AgEAeIAAhFQAQAbgMAzQAAABgEAAIAAgKg");
	this.shape_33.setTransform(66.5191,-95);

	this.shape_34 = new cjs.Shape();
	this.shape_34.graphics.f("#CFC7BA").s().p("AABBXQgsgxgQhOQARgXgCgvIAFAAQAdAoAngFIABgFQAYAkABA/IAFAAQAFBcgbAAQgOAAgXgYg");
	this.shape_34.setTransform(59.0478,-100.8661);

	this.shape_35 = new cjs.Shape();
	this.shape_35.graphics.f("#EBE8E7").s().p("AgiAHIAAgJIAAgKQAPgKAJgSQABgCAFAAQAWAgAPAmQACAEAAAFIgBAFIgJABQghAAgagkg");
	this.shape_35.setTransform(58.5,-112.7171);

	this.shape_36 = new cjs.Shape();
	this.shape_36.graphics.f("#636363").s().p("AAZBfQgBhAgYgjQAAgFgBgFQgPgmgXggQAFAAADgDQACgCAAgFQAxBBATBeIABAKIgKAAIAAAKIAAAKg");
	this.shape_36.setTransform(62,-108.5);

	this.shape_37 = new cjs.Shape();
	this.shape_37.graphics.f("#7D7C84").s().p("AhZAJIAAgJQBhAHBIgQIAKgBQAAAFgBABQg5APhHAAQgYAAgagCg");
	this.shape_37.setTransform(39,-104.9047);

	this.shape_38 = new cjs.Shape();
	this.shape_38.graphics.f("#D2C8BC").s().p("AhAB0IAAgKIAAhGIAAgKIAAgnQAQgnAJgyQAAgBAFAAQAMAWAtgjQACgCAAgFQAFAAAAABIAjCoQAAAFgCAFQgWBEg9AAQgUAAgYgIg");
	this.shape_38.setTransform(18.5,-99.6451);

	this.shape_39 = new cjs.Shape();
	this.shape_39.graphics.f("#E9E7E7").s().p("AgdAcIAAgKIAAgTQAghEAaBEQABAEAAAFQAAAFgCACQgcAVgPAAQgJAAgFgIg");
	this.shape_39.setTransform(18,-112.7692);

	this.shape_40 = new cjs.Shape();
	this.shape_40.graphics.f("#28212F").s().p("ArySLQglgdABg9QABgogZgUQBaiCDIgUIAKgBQBLAABLgDIAUgBIAAgGIAAgJQAvjMCNhuQACgBAAgGQB0mZCRl1QAYg8AEhNQASgbgIg1IAAgKQAAgEgCgDQg2g4gEhrQASg4AVg2QABgFAAgFQASgggIg6IAAgJIAAgKIAAhQQAfiGBbhKQADgCAFAAQA1BMAxBXQADAHAPgBQBnAIBMgWQABAAAAgGQAYhfBPgnQANgHgGAWQAAAEgCADQgDACgFAAQgFAAgBACQgJATgPAJIAAAKIAAALIgFAAQACAvgRAWQAQBPAtAyQBEBIgJiNIAAgJIAAgKIAKAAIAAAKIAAAJIAABHIAAAKIABAJQAGAbgRADQA2BvAZCLIABAKIAAAGQgYglgkhPQAAgEgBgFQgoh7iBANIAAATQgjgxhBhGQgHBNAQA1QABAFAAAEQAAAFgCADQgDADgFgBQAAgEgCgBQh7hHhLB1IAAAKQgFAAgBABQg8BrgsB5QCCBuCuBKQAGABgDAOQgCAGgFAGQgvBSiPgpQgFgBgFgBQg3BWAOCaIABAKIAABaIAAAKIgBAJQgUCbABCwQgFgBgBACQgyCEhUBgQgFAAAAgCQgphghdgpQAoA8AJBZIABALIAABkIAAAKIgBAKQgUDzizBXIgKgCQg9gNgxgaQAAgEgCgEQgSgfgKgpIAAgCIgBgIQgFhxiaAhQAAAGgBAAQhlAWgmBSQgIA/AQAmQACAEAAAGIAAAEQg2gNgugBgADItPIAFAAQBjAeAdhaQACgEAAgGIgjioQAAgBgFAAQAAgGgBgEQgahFghBEIAAAVIAAAKQgFAAAAABQgJAygQAnIAAAnIAAAKIgKAAQAAAoAFAog");
	this.shape_40.setTransform(-8.5,-3.25);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_40},{t:this.shape_39},{t:this.shape_38},{t:this.shape_37},{t:this.shape_36},{t:this.shape_35},{t:this.shape_34},{t:this.shape_33},{t:this.shape_32},{t:this.shape_31},{t:this.shape_30},{t:this.shape_29},{t:this.shape_28},{t:this.shape_27},{t:this.shape_26},{t:this.shape_25},{t:this.shape_24},{t:this.shape_23},{t:this.shape_22},{t:this.shape_21},{t:this.shape_20},{t:this.shape_19},{t:this.shape_18},{t:this.shape_17},{t:this.shape_16},{t:this.shape_15},{t:this.shape_14},{t:this.shape_13},{t:this.shape_12},{t:this.shape_11},{t:this.shape_10},{t:this.shape_9},{t:this.shape_8},{t:this.shape_7},{t:this.shape_6},{t:this.shape_5},{t:this.shape_4},{t:this.shape_3},{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-90,-121,180,242);


(lib.lavrador_dogcopy = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_56();
	this.instance.setTransform(0,0,0.5,0.5);

	this.instance_1 = new lib.CachedBmp_57();
	this.instance_1.setTransform(0,-0.6,0.5,0.5);

	this.instance_2 = new lib.CachedBmp_58();
	this.instance_2.setTransform(0,0,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},49).to({state:[{t:this.instance_2}]},24).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,-0.6,93,73.6);


(lib.brodog = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_53();
	this.instance.setTransform(0,0,0.5,0.5);

	this.instance_1 = new lib.CachedBmp_55();
	this.instance_1.setTransform(13.45,48.55,0.5,0.5);

	this.instance_2 = new lib.CachedBmp_54();
	this.instance_2.setTransform(0,0,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_2},{t:this.instance_1}]},24).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,161,109);


(lib.Tween59 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#906944").s().p("ADSDiQhJgGhHgDInBgGIArgEQgcABgPgMIAAgCIAcAAQgXgDgFgPIAAgEQDHgGDPgFQi3AAi4AHQghABgGgTIAAgFQC+gGDFgEQiqAAiqAHQgmABgJgUIAAgEQC0gGC8gEQihAAigAGQgmACgJgUIAAgEQB5gHB7gDQhhAAhgAFQgoADgLgUQAAgBAAgBQAAAAAAgBQAAAAABAAQAAAAAAAAQAhgJAogCQgoABgigFIAAgjIAAhxIAcAAQgWgCgGgPQAEgIAJgEQgMgGgBgOQADgJArABQAuABgaAEIgEAAQAYAGAegEIAjgCIgCAAIBjgGIjwAAIgDgBQgOgOAUgDIACgBIgEgBQAHgFAmABQAwABgoADIgGAAQA8AEBCgEQgaABgUgEQAsACAlgFIjVAAIgCgBQgEgSAPgCIgCAAIgDAAQABgBAEgBQgNgGAAgPQC+gEClAKIgCAAQgTADAmABIBXAAIgCgBQghACgEgHIAAgBIgCAAQgbgBgXADIgDABQAfgMApAKIAEACQCagKCoAEIAEAAIAAAyIAAACIAAADIAAADIAADyIAAADIAAADIAAACIAACHIAAADQgqAAgvgEQg1gFgdAMIgDAAgAi9h/Qg6AAg5AEIgFACIgEAAQA6ACBCgIgAjFjIQghACgZgFQEzABEtgHQkTgBkLADQg5ABg4AEQAIABgfABIgGAAQBAAGBGgGg");
	this.shape.setTransform(0.003,-0.0071);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-38.4,-22.5,76.9,45.1);


(lib.Tween10 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#FFFFFF").s().p("AcNDBIgEgFQgQgSAAgZQAAgcAUgUQALgLANgEIAAAAIABgBIAAgBIAAgKQAAgcATgTQAUgUAcAAQAaAAATASIADgEQAIgIAJgFIACgBIgDgDQgPgRAAgXQAAgbASgSQATgTAaAAQAbAAASATQAPAOADATIABAMQAAAagTASIgBABQAIAFAHAHIAGAGIAFgDQASgPAagBQAdABAUATQAPAPAEAVIABAJIAAAAIABABQAJAJAEAKIAEANIAAAKQAAAZgRASQgSASgZAAQgZAAgSgSQgIgHgEgJIAAgBIAAAAQgIgDgIgGIgFAFIgGAGQgZAagkAAQgdAAgWgQIgLgKQgHgGgFgHIgKAFIAAABIgBABIAAAAIAAAEQAAAHgCAGIAAABIAAABIgBADQgEAVgPAQQgUATgcAAQgcAAgTgTgAiZCzQgTgNgLgPQgQgXAAgaQAAguAughQAjgXAtgFQgMgUAAgYQAAgiAYgZQAZgYAiAAQAfAAAXAUQAEgmAcgcQAhghAvAAQAuAAAhAhQAVAVAIAaQAEAPAAARQAAAqgaAfIAOgBIASABQBCADAwAXQAxAZAFAiIAAAIQAAAng2AbQg3AchNAAQhOAAg2gcQgLgFgJgGIgEAOQgMAXgcAUQguAghAAAQhBAAgugggABsgTQAEAFAAAHQAAAGgEAEIgCABIgBABIgDAAQAGAAAFgCIAAgBIAAAAIACgCIAAAAQAGgEAAgGQAAgGgGgFQgGgEgJAAQgJAAgHAEIABAAIgBABIgBAAQgCACgBADIAAAAIgCAFQAAAFAFAEIgCgGIAAgBQABgHAEgEQAEgEAHAAIAAAAQAGAAAFAEgABYgQQgEADAAAFIAAABQAAAFAEADIACABIABABIAAAAIAAABIAAAAIAAABIADAAIADAAIABAAIAAAAIAAAAIABgBIAFgCIACgBQADgDAAgFQAAgGgDgDQgEgEgFAAQgGAAgDAEgA5nC4Ig1gJQgZgLgVgVQgLgLgJgNIgIgQQgcALggAHQgGABgGgDQgFgDgBgGIAAgEIgfAEIABAEQAAAGgEAFQgEAEgGABQgVACgXgBIgUAAQgGAAgFgFQgEgFABgGIABgGIgggEQACAEgBAEQgBAGgFAEQgFAEgGgBQgggFgdgJQgGgCgDgGQgDgFACgGQACgGAFgCIgagMIgHgEIAAACQACAGgDAGQgDAFgGACQgGACgFgDQghgSgTgUQgEgFAAgGQAAgGAFgEQAEgFAHAAQAEABAEACQgLgOgEgPIgCgJQgBAEgDADQgEADgGABQgHgBgEgDQgEgEAAgGQAAgLADgKQACgGAFgDQAGgDAGACQAGACACAFIABABQALgqBAggQBNgmBsAAQBXAABDAZIAAgBQAGgCAGACIANAGIAAAAIANAHQAEADACAFIABAAIAAAAIAAABQACAGgDAFQgDAGgGACQgGACgFgDIgEADQghAnAAA0IAAANQAGgrAhghQAJgJAJgGIABAAQARgNAVgGIAqgHIABAAIA1AKQANAGAMAJIgBgHQABgGAEgEQAFgEAGAAQAGABAEAFQAUAXAJAbIADAFQAGAVAAAXIgBAVIgBAEIAAAFQAAA6gpAoQgUAVgZALIg1AJIgBAAgAR9BgQgJgEgGgFQgPgMAAgOQAAgUAegPQAegOArAAQAqAAAeAOIAMAHIABgBQAZgLAiABQAjgBAYALQAYALAAAQIgBAIQgFAKgSAJQgYALgjgBQggAAgYgJIgMAHIgEACQgeAPgqABQgrgBgegPgA5AhhIgDgCIg0gJQgGgBgDgFQgEgGABgGQACgGAFgDQAFgEAGABIA1AKIACABIAIADQAFADACAGQACAGgCAFQgDAGgGACIgFABQgDAAgEgCg");
	this.shape.setTransform(-0.6625,0);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-221.7,-21.2,442.1,42.4);


(lib.Tween9 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#FFFFFF").s().p("AcNDAIgEgEQgQgSAAgZQAAgcAUgTQALgMANgEIAAAAIABgBIAAgBIAAgKQAAgcATgUQAUgTAcAAQAaAAATARIADgDQAIgHAJgGIACgBIgDgDQgPgRAAgYQAAgaASgTQATgSAaAAQAbAAASASQAPAPADATIABALQAAAbgTARIgBACQAIAFAHAHIAGAGIAFgDQASgQAaAAQAdAAAUAVQAPAOAEAVIABAJIAAAAIABABQAJAJAEALIAEAMIAAAKQAAAZgRASQgSASgZAAQgZAAgSgSQgIgHgEgJIAAgBIAAAAQgIgDgIgHIgFAHIgGAFQgZAagkAAQgdAAgWgQIgLgKQgHgGgFgHIgKAFIAAABIgBABIAAAAIAAADQAAAIgCAGIAAABIAAABIgBADQgEAVgPAPQgUAUgcAAQgcAAgTgUgAiZCzQgTgNgLgPQgQgXAAgbQAAgtAughQAjgXAtgGQgMgSAAgZQAAgjAYgYQAZgYAiAAQAfAAAXAUQAEglAcgdQAhghAvAAQAuAAAhAhQAVAVAIAaQAEAQAAARQAAApgaAfIAOAAIASAAQBCADAwAXQAxAZAFAiIAAAIQAAAng2AcQg3AchNAAQhOAAg2gcQgLgGgJgGIgEAOQgMAYgcATQguAhhAgBQhBABgughgABsgSQAEAEAAAHQAAAGgEADIgCACIgBABIgDAAQAGAAAFgDIAAAAIAAgBIACgBIAAAAQAGgEAAgGQAAgGgGgFQgGgEgJAAQgJAAgHAEIABAAIgBABIgBAAQgCACgBADIAAAAIgCAFQAAAFAFAEIgCgGIAAgBQABgHAEgDQAEgFAHAAIAAAAQAGAAAFAFgABYgQQgEADAAAFIAAABQAAAFAEADIACABIABABIAAAAIAAAAIAAABIAAABIADAAIADAAIABAAIAAAAIAAAAIABgBIAFgCIACgBQADgDAAgFQAAgGgDgDQgEgEgFAAQgGAAgDAEgA5nC4Ig1gKQgZgKgVgUQgLgMgJgNIgIgQQgcALggAHQgGABgGgDQgFgDgBgGIAAgEIgfADIABAFQAAAGgEAFQgEAEgGABQgVACgXgBIgUAAQgGAAgFgFQgEgFABgGIABgGIgggEQACAEgBAEQgBAGgFAEQgFAEgGgBQgggFgdgJQgGgCgDgGQgDgFACgGQACgGAFgDIgagLIgHgDIAAABQACAGgDAFQgDAGgGACQgGACgFgDQghgSgTgUQgEgFAAgGQAAgGAFgFQAEgEAHABQAEAAAEACQgLgOgEgOIgCgKQgBAEgDADQgEADgGABQgHgBgEgDQgEgEAAgHQAAgKADgKQACgGAFgDQAGgDAGACQAGACACAFIABABQALgqBAggQBNgmBsAAQBXAABDAYIAAAAQAGgCAGACIANAGIAAAAIANAHQAEADACAEIABABIAAAAIAAABQACAGgDAGQgDAFgGACQgGACgFgDIgEAEQghAnAAAzIAAANQAGgrAhghQAJgIAJgHIABAAQARgNAVgGIAqgHIABAAIA1AKQANAGAMAIIgBgGQABgGAEgEQAFgEAGABQAGAAAEAFQAUAXAJAbIADAFQAGAVAAAYIgBAUIgBAEIAAAFQAAA6gpApQgUAUgZAKIg1AKIgBAAgAR9BhQgJgFgGgFQgPgLAAgOQAAgVAegPQAegPArAAQAqAAAeAPIAMAHIABgBQAZgKAigBQAjABAYAKQAYAMAAAPIgBAIQgFALgSAHQgYAMgjAAQggAAgYgKIgMAHIgEADQgeAPgqgBQgrABgegPgA5AhhIgDgBIg0gKQgGgBgDgGQgEgFABgGQACgGAFgDQAFgEAGABIA1AKIACABIAIADQAFADACAGQACAGgCAFQgDAGgGACIgFABQgDAAgEgCg");
	this.shape.setTransform(-0.6625,0);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-221.7,-21.2,442.1,42.4);


(lib.Tween3copy = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_50();
	this.instance.setTransform(-112.85,-26.65,0.4986,0.4986);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-112.8,-26.6,225.8,53.3);


(lib.red_car_togedercopy1 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_48();
	this.instance.setTransform(47,-16.1,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.red_car_togedercopy1, new cjs.Rectangle(47,-16.1,275.5,142), null);


(lib.men = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#C8D0DB").s().p("AACAJIgEgPQACgFACAJQACAFgCAGg");
	this.shape.setTransform(11.7571,20.3107);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#CFD6E5").s().p("AgCAJIACgGIABAAIACgMQABAOgGAFg");
	this.shape_1.setTransform(12.4267,17.675);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#B5BECE").s().p("AgCAEIAAgBIAAgCIADgFIAAgBIAAAAQADALgDAAIgDgCg");
	this.shape_2.setTransform(11.7167,18.155);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#C18779").s().p("AAEADIAAAAQgEAAgEgCIgBAAIgCgBIAAgBIAAgBQAHABAHACIABAAIgBABQAAAAAAABQAAAAgBAAQAAAAAAAAQgBAAAAAAIgBAAg");
	this.shape_3.setTransform(12.65,12.8813);

	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f("#D9A790").s().p("AgEAAIABAAIABAAQABAAAAAAQABAAAAAAQAAAAAAAAQAAgBAAAAIAAgBIAAgBIAEgCIAAAAIABABQAAAAAAABQAAAAAAAAQAAABAAAAQgBAAAAAAIAAACIAAACIgBAAQgCAEgBAAQgDAAgBgGg");
	this.shape_4.setTransform(13.3563,13.2899);

	this.shape_5 = new cjs.Shape();
	this.shape_5.graphics.f("#202628").s().p("AgBAuIgLgYIAAgBQACgEgBgFIAAgBIAAgBIAAgCIAEgVIAAgBQADgEABgIIAAgBQgCgGgDgDIAAAAQADgJAJgBIAAABIgBAAIgBAAQABACACABIAAAAQACACABAEIAAAAIAAABIgEAHIAAACIAAABIAAAAIAAAKIAAAAIAGAPIAAAAIACANIAAACQgEASgIAOIgBgBg");
	this.shape_5.setTransform(11,21.2);

	this.shape_6 = new cjs.Shape();
	this.shape_6.graphics.f("#CED6E2").s().p("AADALIgKgLQAFAFAEgMIABgDQAEADABAGIAAABQgBAGgDAFg");
	this.shape_6.setTransform(9.7625,18.625);

	this.shape_7 = new cjs.Shape();
	this.shape_7.graphics.f("#CDD4E0").s().p("AAAAHIgCgHIAAgBQACgLACALQACAHgEAAIAAACIAAgBg");
	this.shape_7.setTransform(7.7167,16.6875);

	this.shape_8 = new cjs.Shape();
	this.shape_8.graphics.f("#4D5152").s().p("AgBBGQgWgFgIgUQgRgwgpgaIAAgBIAAgBQACgGAEgEIAAgBQAcgKAbgMQALgEAFgHIgCAQIgBAAIABASIAAABIAAABIABAJIABAAQAIAeALAcIAAABIALAYIABABQAJgOAEgTQAIgZABgfIAAgBIAAAAQACgLgCgIIAAgBQAAAAABAAQAAAAAAgBQABAAAAAAQAAgBAAAAIAAgBIAAgBIABAAQANAVAVAOQAHAFAFAHIAAAHIAAABQgGAFgCAHQgHAcgJAZIgDAAQgTAJgVAHQgMgEgMgCg");
	this.shape_8.setTransform(9,20.525);

	this.shape_9 = new cjs.Shape();
	this.shape_9.graphics.f("#C69A84").s().p("AAEAdQgWgLgCgeQACgHAAgKIAAAAQACAeAQASIAAABQAGgBAEACIAEAAIAGgCIABAAIAAADQgGAGgLACg");
	this.shape_9.setTransform(10.3875,13.275);

	this.shape_10 = new cjs.Shape();
	this.shape_10.graphics.f("#9D7864").s().p("AAJAaQgFgDgGABIAAAAQgPgSgDgeIAAgBQADANAFALIAAAAQACACAEAEIABABQADAGAEAEIAAABQAHAFAKAAIABAAIAAABIAAAAIgCABIgGACIgCAAIgBAAg");
	this.shape_10.setTransform(10.55,12.8125);

	this.shape_11 = new cjs.Shape();
	this.shape_11.graphics.f("#9F6B5D").s().p("AAIAFQgHgCgHgCIAAABIAAABIAAAAIgFgFIAAgCIAAgBIADABIABAAIgBAAIgCAAQADADAGgBIABAAQAEACAGABIAAgBIACABIAAABIAAAAIgDACIAAABIgBAAg");
	this.shape_11.setTransform(12.55,12.45);

	this.shape_12 = new cjs.Shape();
	this.shape_12.graphics.f("#58473F").s().p("AgDAVIABAAQgDgFgFgEIAAABIgBgBQgFgEgBgDIgBAAQgEgKgDgNIAAgCIAAAAQABgBAAAAQAAgBAAAAQAAgBgBAAQAAgBgBAAQAGgFAAAHQAAAVALAJQAGgDAAgHQAAAAABABQAAAAAAAAQAAABABAAQAAAAAAAAIABAAIAAAAQAAAAgBABQAAAAAAAAQAAABgBAAQAAABgBAAQADAUAKgNIAAgBQAFACAEgBIAAABIgBAAIgBABQADALAGgJIAAgBIABAAIAAABIAAABIgEAIIgBAAIAAABIgBABQgFACgFAAQgIAAgGgGg");
	this.shape_12.setTransform(11.125,12.1448);

	this.shape_13 = new cjs.Shape();
	this.shape_13.graphics.f("#DBA68D").s().p("AgGgDQAAAAABAAQAAgBABAAQAAgBAAAAQAAgBAAAAIABgBIABABIACAAIAEAGIAAAAIACABIABABIAAABQgFAFgCAAQgEAAgCgLg");
	this.shape_13.setTransform(11.45,12.81);

	this.shape_14 = new cjs.Shape();
	this.shape_14.graphics.f("#43332C").s().p("AAPAIIAAgCIgDgBIAAAAQgEgDgHgBIAAAAIgGAAIAAAAIgEgBIAAABIAAABIgBAAIgCgBIgBAAQAAAAAAAAQgBAAAAAAQAAgBAAAAQgBAAAAAAIAAgBQAIgBAGgEIAAAAIAEAAIABAAQAJAEADAIIAAACIgBAAg");
	this.shape_14.setTransform(12.325,11.9);

	this.shape_15 = new cjs.Shape();
	this.shape_15.graphics.f("#EADED4").s().p("AgDACIACgCIAAgCQABAAAAAAQABABAAAAQABAAAAAAQABABAAAAIAAAAIAAABIAAABIAAAAIgCABIgEgBg");
	this.shape_15.setTransform(11.8,8.37);

	this.shape_16 = new cjs.Shape();
	this.shape_16.graphics.f("#50392B").s().p("AACABQAAAAgBgBQAAAAgBAAQAAAAAAAAQgBAAgBAAIAAgBQADAAABABIAAABIAAABIAAgBg");
	this.shape_16.setTransform(11.9,8.175);

	this.shape_17 = new cjs.Shape();
	this.shape_17.graphics.f("#251F10").s().p("AAAABIgBAAQgBAAAAAAQgBAAAAAAQAAAAAAgBQgBAAAAAAQAEgBADABIABAAIAAAAIAAAAIgDACIgBgBg");
	this.shape_17.setTransform(11.2,8.1469);

	this.shape_18 = new cjs.Shape();
	this.shape_18.graphics.f("#31211B").s().p("AADABIgNAAIAAgBQAKgIALAIIAAABQAAABgBABQAAAAAAABQAAAAgBAAQAAABgBAAQgBAAgEgEg");
	this.shape_18.setTransform(11.425,7.5875);

	this.shape_19 = new cjs.Shape();
	this.shape_19.graphics.f("#E8E0D1").s().p("AgBABIAAgBIABgBIAAAAIACABIAAAAIgBAAIgCACIAAgBg");
	this.shape_19.setTransform(14.475,9.0667);

	this.shape_20 = new cjs.Shape();
	this.shape_20.graphics.f("#595042").s().p("AgDgBQADgBAEABIAAAAIAAABIAAAAIgCACIAAABIgBAAIgBAAQgCAAgBgEg");
	this.shape_20.setTransform(14.075,8.945);

	this.shape_21 = new cjs.Shape();
	this.shape_21.graphics.f("#271B17").s().p("AAHADQgCgBgFAAIAAAAIgHAAIAAgBQABAAAAAAQAAAAAAgBQAAAAABAAQAAAAAAAAIAAgBIACgBIABAAIAHAAIABAAIABAAQABACAAACIAAABg");
	this.shape_21.setTransform(14.4313,8.225);

	this.shape_22 = new cjs.Shape();
	this.shape_22.graphics.f("#DDAC90").s().p("AgXAPQAAgHgGAFIAAAAQgCgEgDgCIAAAAIgDgHIABAAIgCgKIAAgBIACgCIAAgBQAFgMAFALIAEAGQgBAHABAEQAEgLAGgLIAAgLQADgJAIgFIABAAIAHADIAAgBIAOAJIAAACQACABAEAAIACAAIAHAEIABABQACAGAAAIIgBAAQAAAGgBADIgBAAIAAgBIgJAAIAAABIgBAAIgCABIgBAAIgDACQAAABAAAAQAAAAAAABQAAAAABAAQAAAAAAAAIABAAIAIgBIAAAAQAFAAACABIABAAIAAABQgCAXgIAQIAAAAQgBABAAABQAAAAgBABQAAAAAAAAQAAAAAAgBIgBgBIAAAAIAAgBQgDgKgJgEIgBgBQgCgEgDADIAAABIAAABIAAAAQgGAEgHABIAAABQAAAJgGACQgLgJAAgVgAAcAIQAAABABAAQAAAAAAAAQABAAAAgBQABAAABgBIABAAIAAAAQADgDgFAAIAAAAQgGgBgDABQACAGADgCIABAAgAgbAHIgBgJIAAAAQACgOgHAOQACAEAEAFIAAAAgAAAACQAEACADgBIAAgBIABAAQAGAAgHgCIAAgBQgCgCgDABIgBAAQgEgBgDABQAAABAAAAQAAABABAAQAAAAAAAAQABAAAAAAIABAAQAAACADAAgAgKgHIAAABIANABQAHAFABgFIAAgCQgGgEgFAAQgFAAgFAEgAgigNIgBACIAEgFIgDADg");
	this.shape_22.setTransform(11.4292,8.35);

	this.shape_23 = new cjs.Shape();
	this.shape_23.graphics.f("#271F1E").s().p("AgdAfIgDgGQgGgLgEALIAAgHIgBAAQgCgEAAgFQAEgBgBgFIAAgBIACgCIAAgBIABAAQAIgIgJAGIAAgBIAAgBQAHgGgFACIgBAAIgBAAIgBAAIAAgBIAHgHIABAAQAHACAAgFIgBAAIAAgBIAAgDQADgLABAJQADgHAHgFIACgBIAAAAQAAABAAAAQAAABgBAAQAAAAgBABQAAAAgBAAIAAABIAAAAIgDADQAAABAAAAQABAAAAAAQAAAAABgBQABAAABgBIAAgBQABgBAAAAQAAgBABAAQAAAAABAAQAAAAABAAIABAAQADgEAFgBIAAgBIAFAAIABAAQABAEAGAAIABgBIAAABIgDABIABACIABAAIADADIABAAIAGAAIAAAAQAMAGACAPIAAABQAHACABAHIABANIAAAAIAAACIAAAHIAAABIAAABQgDAFgGACIAAABIAAABIAAAAIgBAAIAAADIgBAAQAAAAAAgBQAAAAgBAAQAAgBAAAAQAAAAgBAAIAAABIAAABIAAAAIgBgHQABgJgDgFIAAgBIgHgFIgCAAQgEABgCgCIAAgBIgOgIIAAABIgIgDIgBAAQgHAEgDAIIAAAMQgHAKgEANQgBgFABgHg");
	this.shape_23.setTransform(12.075,4.275);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_23},{t:this.shape_22},{t:this.shape_21},{t:this.shape_20},{t:this.shape_19},{t:this.shape_18},{t:this.shape_17},{t:this.shape_16},{t:this.shape_15},{t:this.shape_14},{t:this.shape_13},{t:this.shape_12},{t:this.shape_11},{t:this.shape_10},{t:this.shape_9},{t:this.shape_8},{t:this.shape_7},{t:this.shape_6},{t:this.shape_5},{t:this.shape_4},{t:this.shape_3},{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.men, new cjs.Rectangle(0,0,18,28.2), null);


(lib.Tween35 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_83();
	this.instance.setTransform(-25,-124.8,0.5,0.5);

	this.instance_1 = new lib.r_l_women();
	this.instance_1.setTransform(-7.4,89.4,1,1,0,0,0,23.2,68.1);

	this.instance_2 = new lib.CachedBmp_82();
	this.instance_2.setTransform(-57.25,-130.8,0.5,0.5);

	this.instance_3 = new lib.CachedBmp_88();
	this.instance_3.setTransform(-62.35,-157.55,0.5,0.5);

	this.instance_4 = new lib.CachedBmp_86();
	this.instance_4.setTransform(-26.1,-126.4,0.5,0.5);

	this.instance_5 = new lib.CachedBmp_85();
	this.instance_5.setTransform(-57.25,-130.8,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_3},{t:this.instance_2},{t:this.instance_1},{t:this.instance}]}).to({state:[{t:this.instance_3},{t:this.instance_5},{t:this.instance_1},{t:this.instance_4}]},24).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-62.3,-157.5,125,315.3);


(lib.Tween17 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.rl();
	this.instance.setTransform(17.55,34.25,1,1,0,0,0,6.6,34.8);

	this.instance_1 = new lib.ll();
	this.instance_1.setTransform(-1.2,34.5,1,1,5.4567,0,0,7.2,30.8);

	this.instance_2 = new lib.CachedBmp_79();
	this.instance_2.setTransform(-24.95,-69.05,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_2},{t:this.instance_1},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-24.9,-69,49.099999999999994,138.1);


(lib.Tween14 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.rl();
	this.instance.setTransform(17.55,34.25,1,1,0,0,0,6.6,34.8);

	this.instance_1 = new lib.ll();
	this.instance_1.setTransform(2.55,35.55,1,1,-1.5022,0,0,7.2,30.9);

	this.instance_2 = new lib.CachedBmp_78();
	this.instance_2.setTransform(-24.95,-69.05,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_2},{t:this.instance_1},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-24.9,-69,49.099999999999994,138.1);


(lib.Tween13 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.Tween17("synched",0);

	this.timeline.addTween(cjs.Tween.get(this.instance).to({x:0.05,y:-0.05},9).to({_off:true},1).wait(7));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-24.9,-69.1,49.2,138.2);


(lib.Tween12 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.ll();
	this.instance.setTransform(1.65,35.3,1,1,0,0,0,7.1,30.8);

	this.instance_1 = new lib.CachedBmp_77();
	this.instance_1.setTransform(-24.95,-69.05,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_1},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-24.9,-69,49,138);


(lib.znav_miniminidog = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#E26E2B").s().p("AgLAHIAAgHIAGAAIAAgDIALAAIAAgDIAGAAIAAAGIgGAAIAAAEIgGAAIAAADg");
	this.shape.setTransform(6.525,12.5);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#E6C4B0").s().p("AgFAFIAAgDIgGAAIAAgGIAXAAIAAADIgMAAIAAADIAGAAIAAADg");
	this.shape_1.setTransform(4.75,0.525);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#E06B29").s().p("AgLARIAAgDIgLAAIAAgDIALAAIAAgLIALAAIAAgCIAMAAIAAgHIAFAAIAAgHIAHAAIAAAKIgHAAIAAAGIgLAAIAAAEIgGAAIAAAHIgFAAIAAAGg");
	this.shape_2.setTransform(10.05,10.425);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#E16E2B").s().p("AADAQIAAgLIgFAAIAAgDIgGAAIAAgDIgGAAIAAgKIgFAAIAAgEIALAAIAAAHIAGAAIAAAEIAFAAIAAAGIAGAAIAAADIALAAIAAAEIgFAAIAAADIgGAAIAAAEg");
	this.shape_3.setTransform(12.1,3.625);

	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f("#EE8C4F").s().p("AhMBDIAAgNIAkAAIAAgDIAMAAIAAgEIAMAAIAAgDIAFAAIAAgDIAGAAIAAgEIAFAAIAAgDIAGAAIAAgEIAGAAIAAgHIAGAAIAAgDIAGAAIAAgLIAGAAIAAgiIgGAAIAAgDIgGAAIAAgHIgGAAIAAgHIgGAAIAAgEIgGAAIAAgDIgFAAIAAgEIgGAAIAAgDIgFAAIAAgDIgGAAIAAgEIgGAAIAAgDIAMAAIAcAAIAAADIASAAIAAAEIALAAIAAADIAGAAIAAADIAGAAIAAAEIAGAAIAAADIAGAAIAAAEIAGAAIAAAKIAGAAIAAAwIgGAAIAAAHIgGAAIAAAEIgGAAIAAAHIgGAAIAAAHIgGAAIAAADIgGAAIAAADIgFAAIAAAEIgMAAIAAADIgGAAIAAAEIgGAAIAAADIgMAAIAAAEIgFAAIAAACgAgWA9IALAAIAAgDIAGAAIAAgEIAFAAIAAgHIAMAAIAAAEIAGAAIAAgHIAGAAIAAgHIAGAAIAAgDIALAAIAAgHIAGAAIAAgLIgGAAIAAAHIgFAAIAAAHIgMAAIAAAEIgMAAIAAAKIgMAAIAAADIgFAAIAAAEIgLAAIAAADIgGAAgAAYguIAGAAIAAALIAGAAIAAADIAFAAIAAAEIAGAAIAAAKIAGAAIAAgDIAGAAIAAgEIAGAAIAAgDIgMAAIAAgEIgGAAIAAgHIgGAAIAAgDIgFAAIAAgHIgMAAg");
	this.shape_4.setTransform(7.675,7.075);

	this.instance = new lib.Tween31("synched",0);
	this.instance.setTransform(7.65,6.9);
	this.instance._off = true;

	this.instance_1 = new lib.Tween32("synched",0);
	this.instance_1.setTransform(6.6,6.15);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_4},{t:this.shape_3},{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).to({state:[{t:this.instance}]},49).to({state:[{t:this.instance_1}]},22).wait(1));
	this.timeline.addTween(cjs.Tween.get(this.instance).wait(49).to({_off:false},0).to({_off:true,x:6.6,y:6.15},22).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-1,-1.5,16.4,15.4);


(lib.Tween28 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.Tween29("synched",0);

	this.instance_1 = new lib.Tween30("synched",0);
	this.instance_1.setTransform(-1.35,0);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},24).wait(1));
	this.timeline.addTween(cjs.Tween.get(this.instance).to({_off:true,x:-1.35},24).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-65.4,-76.1,128.2,152.5);


(lib.Symbol1 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.znav_miniminidog();
	this.instance.setTransform(71.25,16.65,1,1,0,0,0,7.7,6.9);

	this.instance_1 = new lib.CachedBmp_60();
	this.instance_1.setTransform(0,0,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_1},{t:this.instance}]}).to({state:[{t:this.instance_1},{t:this.instance}]},49).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,78.9,49.5);


(lib.ozen_lav = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.Tween33("synched",0);
	this.instance.setTransform(12.75,14.5);

	this.instance_1 = new lib.Tween34("synched",0);
	this.instance_1.setTransform(12.75,12.7);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},24).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,-0.5,25.5,29.6);


(lib.minidog = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.Tween24("synched",0);
	this.instance.setTransform(44.9,60.45);

	this.instance_1 = new lib.Tween22("synched",0);
	this.instance_1.setTransform(45.3,60.45);
	this.instance_1._off = true;

	this.instance_2 = new lib.Tween23("synched",0);
	this.instance_2.setTransform(45.3,60.45);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},24).to({state:[{t:this.instance_2}]},45).wait(1));
	this.timeline.addTween(cjs.Tween.get(this.instance).to({_off:true,x:45.3},24).wait(46));
	this.timeline.addTween(cjs.Tween.get(this.instance_1).to({_off:false},24).to({_off:true},45).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,90.5,121);


(lib.mini_dog = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.Symbol1();
	this.instance.setTransform(39.5,24.7,1,1,0,0,0,39.5,24.7);

	this.timeline.addTween(cjs.Tween.get(this.instance).to({x:12.5},30).to({x:-56.45,y:35.7},15).wait(30));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-95.9,0,174.8,60.5);


(lib.dog3 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.Tween27("synched",0);
	this.instance.setTransform(62.7,76.15);

	this.instance_1 = new lib.Tween28("synched",0);
	this.instance_1.setTransform(62.7,76.15);

	this.shape = new cjs.Shape();
	this.shape.graphics.f("#D9B6AB").s().p("AAAAFIgBAAIAAgBIgBgBIAAgBIgBgBIAAgBIAAAAIAAgBIABAAIAAgBIAAgBIABAAIABgBIAAAAIAAAAIAAAAIABAAIAAABIABAAIAAAAIABAAIAAABIABAAIAAABIAAAAIAAABIAAABIAAABIAAAAIgBABIgBABIgBABIgBAAIAAAAIAAAAg");
	this.shape.setTransform(-66.45,56.3625);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},24).to({state:[{t:this.instance_1},{t:this.shape}]},48).wait(1));
	this.timeline.addTween(cjs.Tween.get(this.instance).to({_off:true},24).wait(49));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-66.8,0,192.3,152.5);


(lib.dog_aski = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.Tween19("synched",0);
	this.instance.setTransform(90,121);

	this.instance_1 = new lib.Tween21("synched",0);
	this.instance_1.setTransform(87.25,121);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},30).wait(14));
	this.timeline.addTween(cjs.Tween.get(this.instance).to({_off:true,x:87.25},30).wait(14));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-5.5,0,185.5,242);


(lib.Tween8 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.Tween10("synched",0);

	this.timeline.addTween(cjs.Tween.get(this.instance).to({x:194.2},263).to({_off:true},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-221.7,-21.2,636.3,42.4);


(lib.Tween7copyleft = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.Tween9("synched",0);
	this.instance.setTransform(469.95,11.75);
	this.instance._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(6).to({_off:false},0).to({_off:true},1).wait(5).to({_off:false},0).to({_off:true},1).wait(211));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,-9.4,690.4,42.4);


(lib.Tween7 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.Tween8("synched",42);
	this.instance.setTransform(76.2,1.9);
	this.instance._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(42).to({_off:false},0).to({x:290.3,y:7.25,startPosition:160},118).to({_off:true},1).wait(104));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,0,0);


(lib.shar = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.Tween59("synched",0);
	this.instance.setTransform(38.45,22.55);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.shar, new cjs.Rectangle(0,0,76.9,45.1), null);


(lib.glgl_red_car = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.Tween3copy("synched",0);
	this.instance.setTransform(112.9,26.7);

	this.timeline.addTween(cjs.Tween.get(this.instance).to({_off:true},9).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,225.9,53.4);


(lib.Tween54 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_37();
	this.instance.setTransform(-15.5,-29.7,0.1474,0.1474);

	this.instance_1 = new lib.men();
	this.instance_1.setTransform(-4,-23.05,1,1,0,0,0,9,14.1);

	this.instance_2 = new lib.CachedBmp_36();
	this.instance_2.setTransform(-2.7,-29.2,0.1474,0.1474);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_2},{t:this.instance_1},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-15.5,-37.1,31.1,74.30000000000001);


(lib.Tween53 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_35();
	this.instance.setTransform(-13.45,-29.7,0.1474,0.1474);

	this.instance_1 = new lib.men();
	this.instance_1.setTransform(-1.95,-23.05,1,1,0,0,0,9,14.1);

	this.instance_2 = new lib.CachedBmp_36();
	this.instance_2.setTransform(-0.65,-29.2,0.1474,0.1474);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_2},{t:this.instance_1},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-13.4,-37.1,26.9,74.30000000000001);


(lib.Tween50 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_33();
	this.instance.setTransform(-12.8,-30,0.3757,0.3757);

	this.instance_1 = new lib.men();
	this.instance_1.setTransform(-1.3,-23.35,1,1,0,0,0,9,14.1);

	this.instance_2 = new lib.CachedBmp_32();
	this.instance_2.setTransform(-0.25,-29.75,0.3757,0.3757);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_2},{t:this.instance_1},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-12.8,-37.4,25.6,75);


(lib.Tween49 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_31();
	this.instance.setTransform(-12.8,-29.7,0.3757,0.3757);

	this.instance_1 = new lib.men();
	this.instance_1.setTransform(-1.3,-23.05,1,1,0,0,0,9,14.1);

	this.instance_2 = new lib.CachedBmp_32();
	this.instance_2.setTransform(-0.25,-29.45,0.3757,0.3757);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_2},{t:this.instance_1},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-12.8,-37.1,25.6,74.30000000000001);


(lib.Tween48 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.Tween53("synched",0);
	this.instance.setTransform(0.65,0);

	this.instance_1 = new lib.Tween54("synched",0);
	this.instance_1.setTransform(2.7,0);
	this.instance_1._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance).to({_off:true,x:2.7},24).wait(49));
	this.timeline.addTween(cjs.Tween.get(this.instance_1).to({_off:false},24).to({x:0.65},23).to({_off:true},1).wait(25));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-14.8,-37.1,33.1,74.30000000000001);


(lib.menncopy = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.Tween48("synched",0);
	this.instance.setTransform(10.3,37.15);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(48));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-4.5,0,33.1,74.4);


(lib.menn = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.Tween48("synched",0);
	this.instance.setTransform(10.3,37.15);

	this.instance_1 = new lib.Tween49("synched",0);
	this.instance_1.setTransform(10.3,37.15);
	this.instance_1._off = true;

	this.instance_2 = new lib.Tween50("synched",0);
	this.instance_2.setTransform(10.3,37.45);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},24).to({state:[{t:this.instance_2}]},24).wait(1));
	this.timeline.addTween(cjs.Tween.get(this.instance).to({_off:true},24).wait(25));
	this.timeline.addTween(cjs.Tween.get(this.instance_1).to({_off:false},24).to({_off:true,y:37.45},24).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-2.5,0,28.9,75.1);


(lib.men2 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_29();
	this.instance.setTransform(-3.55,32.45,0.5,0.5);

	this.instance_1 = new lib.menn();
	this.instance_1.setTransform(7.55,4.55,1,1,0,0,0,10.3,36.6);

	this.instance_2 = new lib.CachedBmp_28();
	this.instance_2.setTransform(-10.7,-19.95,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_2},{t:this.instance_1},{t:this.instance}]}).to({state:[{t:this.instance_2},{t:this.instance_1},{t:this.instance}]},19).to({state:[]},1).wait(15));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-10.7,-32,32.4,74.3);


(lib.men_b = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.menncopy();
	this.instance.setTransform(7.55,5.4,1,1,0,0,0,10.3,36.6);

	this.shape = new cjs.Shape();
	this.shape.graphics.f("#9DA3AA").s().p("AAAADIAAgHIAAAAIAAABQABAEgBAEIAAgCg");
	this.shape.setTransform(-10.655,-19.7);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape},{t:this.instance}]}).to({state:[{t:this.shape},{t:this.instance}]},4).to({state:[]},1).wait(151));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-10.7,-31.2,32.4,74.4);


(lib.women3copy = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.Tween35("synched",0);
	this.instance.setTransform(62.35,157.55);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(48));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,125,315.4);


(lib.women3 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.Tween35("synched",0);
	this.instance.setTransform(62.35,157.55);

	this.instance_1 = new lib.Tween36("synched",0);
	this.instance_1.setTransform(62.35,157.55);
	this.instance_1._off = true;

	this.instance_2 = new lib.Tween37("synched",0);
	this.instance_2.setTransform(62.35,168.35);
	this.instance_2._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance).to({_off:true},24).wait(50));
	this.timeline.addTween(cjs.Tween.get(this.instance_1).to({_off:false},24).to({_off:true,y:168.35},18).wait(32));
	this.timeline.addTween(cjs.Tween.get(this.instance_2).wait(24).to({_off:false},18).to({x:26.35,y:145.35},31).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-36,-23,161,359.8);


(lib.women1 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.Tween12("synched",0);
	this.instance.setTransform(24.15,69.05);

	this.instance_1 = new lib.Tween13("synched",0);
	this.instance_1.setTransform(24.15,69.05);

	this.instance_2 = new lib.Tween14("synched",0);
	this.instance_2.setTransform(24.15,69.05);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},14).to({state:[{t:this.instance_2}]},10).wait(14));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-0.8,0,49.199999999999996,138.1);


(lib.Tween40 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_90();
	this.instance.setTransform(-27.05,-125.85,0.5,0.5);

	this.instance_1 = new lib.Tween35("synched",0);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_1},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-62.3,-157.5,125,315.3);


(lib.Tween38 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.women3();
	this.instance.setTransform(103.85,0.05,1,1,0,0,0,62.4,157.6);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(41.5,-157.5,125,315.3);


(lib.Tween26 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.ozen_lav();
	this.instance.setTransform(30.4,-39.2,1,1,0,0,0,12.8,14.5);

	this.instance_1 = new lib.ozen_lav();
	this.instance_1.setTransform(31,-38.85,1,1,0,0,0,12.8,14.5);

	this.instance_2 = new lib.CachedBmp_64();
	this.instance_2.setTransform(-45.15,-54.05,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_2},{t:this.instance_1},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-45.1,-54,90.5,108);


(lib.minimini_dog = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.mini_dog();
	this.instance.setTransform(39.5,24.7,1,1,0,0,0,39.5,24.7);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(75).to({x:-137.25},57).to({x:-174.45},12).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-213.9,0,292.8,49.5);


(lib.lavrador_dog = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.Tween25("synched",0);
	this.instance.setTransform(45.8,54.05);

	this.instance_1 = new lib.Tween26("synched",0);
	this.instance_1.setTransform(46.4,54.05);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},17).wait(1));
	this.timeline.addTween(cjs.Tween.get(this.instance).to({_off:true,x:46.4},17).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,92.1,108);


(lib.Tween45 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.Tween7copyleft("synched",12);
	this.instance.setTransform(-134.8,-182.9,1,1,0,0,0,406.2,7);

	this.instance_1 = new lib.CachedBmp_52();
	this.instance_1.setTransform(-326.45,-243.9,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_1},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-326.4,-243.9,653,488);


(lib.Tween44 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.Tween7copyleft("synched",6);
	this.instance.setTransform(15.25,-191.9,1,1,0,0,0,406.2,7);

	this.instance_1 = new lib.CachedBmp_51();
	this.instance_1.setTransform(-326.45,-243.9,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_1},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-326.4,-243.9,653,488);


(lib.red_carcopy = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.glgl_red_car();
	this.instance.setTransform(185.75,90.65,1,1,0,0,0,112.9,26.7);

	this.instance_1 = new lib.CachedBmp_49();
	this.instance_1.setTransform(47,-16.1,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_1},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.red_carcopy, new cjs.Rectangle(47,-16.1,275.5,133.5), null);


(lib.red_car_togeder = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.lavrador_dogcopy();
	this.instance.setTransform(132.7,25.5,0.6801,0.4077,0,0,0,45.9,54);

	this.instance_1 = new lib.Bitmap23();
	this.instance_1.setTransform(177.35,-1.35,0.1156,0.0739,0,0,-8.4702);

	this.instance_2 = new lib.glgl_red_car();
	this.instance_2.setTransform(185.75,90.65,1,1,0,0,0,112.9,26.7);

	this.instance_3 = new lib.CachedBmp_47();
	this.instance_3.setTransform(47,-16.1,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_3},{t:this.instance_2},{t:this.instance_1},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.red_car_togeder, new cjs.Rectangle(47,-16.1,275.5,133.5), null);


(lib.red_car = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.glgl_red_car();
	this.instance.setTransform(185.75,90.65,1,1,0,0,0,112.9,26.7);

	this.instance_1 = new lib.Bitmap23();
	this.instance_1.setTransform(169.15,8.45,0.1397,0.057,0,0,-8.9056);

	this.instance_2 = new lib.CachedBmp_46();
	this.instance_2.setTransform(46.95,-16.1,0.4986,0.4986);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_2},{t:this.instance_1},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.red_car, new cjs.Rectangle(47,-16.1,275.7,133.5), null);


(lib.button_end = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.text = new cjs.Text("Click to start again", "24px 'Perpetua Titling MT'", "#333333");
	this.text.textAlign = "center";
	this.text.lineHeight = 30;
	this.text.lineWidth = 95;
	this.text.parent = this;
	this.text.setTransform(191.2,10.7818,1,0.8246);

	this.instance = new lib.men_b("synched",0);
	this.instance.setTransform(96.95,126.7,2.9144,3.3921,0,0,3.7534);

	this.instance_1 = new lib.lavrador_dog();
	this.instance_1.setTransform(186.2,149.4,0.8874,0.8687,0,0,180,45.8,0.1);

	this.instance_2 = new lib.women3copy();
	this.instance_2.setTransform(219.95,64.1,0.4552,0.62,0,0,5.2162);

	this.instance_3 = new lib.CachedBmp_42();
	this.instance_3.setTransform(-0.9,-1.15,0.5,0.5);

	this.instance_4 = new lib.women3();
	this.instance_4.setTransform(248.35,164.8,0.4552,0.62,0,0,5.2162,62.6,158.2);

	this.instance_5 = new lib.CachedBmp_43();
	this.instance_5.setTransform(-0.9,-1.15,0.5,0.5);

	this.instance_6 = new lib.CachedBmp_44();
	this.instance_6.setTransform(-0.9,-1.15,0.5,0.5);

	this.instance_7 = new lib.CachedBmp_45();
	this.instance_7.setTransform(-0.9,-1.15,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_3},{t:this.instance_2},{t:this.instance_1,p:{regY:0.1,scaleX:0.8874,scaleY:0.8687,x:186.2,y:149.4}},{t:this.instance,p:{regX:0,regY:0,x:96.95,y:126.7}},{t:this.text,p:{scaleX:1,x:191.2,font:"24px 'Perpetua Titling MT'",lineHeight:30.4}}]}).to({state:[{t:this.instance_5},{t:this.instance_4},{t:this.instance,p:{regX:5.7,regY:5.2,x:113.55,y:145.45}},{t:this.instance_1,p:{regY:54.1,scaleX:0.9959,scaleY:0.9611,x:186.15,y:196.3}},{t:this.text,p:{scaleX:0.8993,x:191.2043,font:"bold 24px 'Perpetua Titling MT'",lineHeight:30.85}}]},1).to({state:[{t:this.instance_6},{t:this.instance_4},{t:this.instance,p:{regX:5.7,regY:5.2,x:113.55,y:145.45}},{t:this.instance_1,p:{regY:54.1,scaleX:0.9959,scaleY:0.9611,x:186.15,y:196.3}},{t:this.text,p:{scaleX:0.8993,x:191.2043,font:"bold 24px 'Perpetua Titling MT'",lineHeight:30.85}}]},1).to({state:[{t:this.instance_7},{t:this.instance_4},{t:this.instance,p:{regX:5.7,regY:5.2,x:113.55,y:145.45}},{t:this.instance_1,p:{regY:54.1,scaleX:0.9959,scaleY:0.9611,x:186.15,y:196.3}},{t:this.text,p:{scaleX:0.8993,x:191.2043,font:"bold 24px 'Perpetua Titling MT'",lineHeight:30.85}}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-0.9,-1.1,377.5,305.5);


(lib.Tween51 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.menn();
	this.instance.setTransform(7.55,4.55,1,1,0,0,0,10.3,36.6);

	this.shape = new cjs.Shape();
	this.shape.graphics.f("#9DA3AA").s().p("AAAADIAAgHIAAAAIAAABQABAEgBAEIAAgCg");
	this.shape.setTransform(-10.655,-19.7);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-10.7,-32,32.4,74.3);


(lib.Tween47 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.lavrador_dog();
	this.instance.setTransform(-20.05,31,0.5155,0.4619,0,0,180,45.8,54.1);

	this.instance_1 = new lib.women3();
	this.instance_1.setTransform(28.65,0.05,0.2414,0.3665,0,0,0,62.4,157.7);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_1},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-43.6,-57.7,87.4,115.6);


(lib.Tween46 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.lavrador_dog();
	this.instance.setTransform(-20.05,31,0.5155,0.4619,0,0,180,45.8,54.1);

	this.instance_1 = new lib.women3();
	this.instance_1.setTransform(28.65,0.05,0.2414,0.3665,0,0,0,62.4,157.7);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_1},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-43.6,-57.7,87.4,115.6);


(lib.Tween41 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_91();
	this.instance.setTransform(-32.3,-134.8,0.5,0.5);

	this.instance_1 = new lib.Tween40("synched",0);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_1},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-62.3,-157.5,125,315.3);


(lib.women3face = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.Tween41("synched",0);
	this.instance.setTransform(62.35,157.55);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(73).to({startPosition:0},0).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,125,315.4);


// stage content:
(lib.ani_mid = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	this.actionFrames = [0,504,507];
	this.streamSoundSymbolsList[0] = [{id:"ADogIsAFriendGreatSongForAllDogLoversmp3cutnet",startFrame:0,endFrame:504,loop:1,offset:0}];
	this.streamSoundSymbolsList[504] = [{id:"ADogIsAFriendGreatSongForAllDogLoversmp3cutnet",startFrame:504,endFrame:507,loop:1,offset:0}];
	// timeline functions:
	this.frame_0 = function() {
		this.clearAllSoundStreams();
		 
		var soundInstance = playSound("ADogIsAFriendGreatSongForAllDogLoversmp3cutnet",0);
		this.InsertIntoSoundStreamData(soundInstance,0,504,1);
		var self = this; 
		self.stop();
		
		self.start.addEventListener("click", startPlaying);
		
		function startPlaying()
		{
			self.gotoAndPlay(10); 
		}
	}
	this.frame_504 = function() {
		var soundInstance = playSound("ADogIsAFriendGreatSongForAllDogLoversmp3cutnet",0);
		this.InsertIntoSoundStreamData(soundInstance,504,507,1);
	}
	this.frame_507 = function() {
		var self = this; 
		self.stop();
		
		
		self.replay.addEventListener("click", playAgain);
		
		function playAgain()
		{	
			self.gotoAndPlay(10); 
		}
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(504).call(this.frame_504).wait(3).call(this.frame_507).wait(1));

	// button_end
	this.replay = new lib.button_end();
	this.replay.name = "replay";
	this.replay.setTransform(308.55,263.45,1,1,0,0,0,187.5,151.5);
	this.replay._off = true;
	new cjs.ButtonHelper(this.replay, 0, 1, 2, false, new lib.button_end(), 3);

	this.timeline.addTween(cjs.Tween.get(this.replay).wait(507).to({_off:false},0).wait(1));

	// women_2
	this.instance = new lib.CachedBmp_2();
	this.instance.setTransform(504.3,169.95,0.5,0.5);

	this.instance_1 = new lib.CachedBmp_1();
	this.instance_1.setTransform(370.4,143.2,0.5,0.5);

	this.instance_2 = new lib.Tween38("synched",0);
	this.instance_2.setTransform(473.8,317.8);
	this.instance_2._off = true;

	this.instance_3 = new lib.women3face();
	this.instance_3.setTransform(541.05,322.05,0.9381,0.9746,0,0,24.1837,62.4,157.6);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.instance_1},{t:this.instance}]},168).to({state:[{t:this.instance_2}]},20).to({state:[{t:this.instance_2}]},12).to({state:[{t:this.instance_2}]},11).to({state:[{t:this.instance_3}]},1).to({state:[]},52).to({state:[]},52).wait(192));
	this.timeline.addTween(cjs.Tween.get(this.instance_2).wait(188).to({_off:false},0).to({scaleX:0.9691,scaleY:0.9873,skewY:12.0913,x:461.75,y:290.1},12).to({scaleX:0.9407,scaleY:0.9756,skewY:23.1756,x:450.55,y:264.75},11).to({_off:true,regX:62.4,regY:157.6,scaleX:0.9381,scaleY:0.9746,skewY:24.1837,x:541.05,y:322.05,mode:"independent"},1).wait(296));

	// mask_dog (mask)
	var mask = new cjs.Shape();
	mask._off = true;
	var mask_graphics_241 = new cjs.Graphics().p("AoLIFQjYjWAAkvQAAkuDYjWQDZjXEyABQEygBDZDXQDZDWAAEuQAAEvjZDWQjZDXkyAAQkyAAjZjXg");
	var mask_graphics_263 = new cjs.Graphics().p("AqRKMQkQkOAAl+QAAl8EQkPQERkOGAABQGBgBEQEOQEREPAAF8QAAF+kREOQkQEOmBAAQmAAAkRkOg");

	this.timeline.addTween(cjs.Tween.get(mask).to({graphics:null,x:0,y:0}).wait(241).to({graphics:mask_graphics_241,x:385,y:293.2}).wait(22).to({graphics:mask_graphics_263,x:385,y:293.2}).wait(29).to({graphics:null,x:0,y:0}).wait(216));

	// lavrador
	this.instance_4 = new lib.lavrador_dog();
	this.instance_4.setTransform(373,297.1,1,1,0,0,0,45.8,54.1);
	this.instance_4._off = true;

	var maskedShapeInstanceList = [this.instance_4];

	for(var shapedInstanceItr = 0; shapedInstanceItr < maskedShapeInstanceList.length; shapedInstanceItr++) {
		maskedShapeInstanceList[shapedInstanceItr].mask = mask;
	}

	this.timeline.addTween(cjs.Tween.get(this.instance_4).wait(120).to({_off:false},0).wait(169).to({_off:true},3).wait(216));

	// hert
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#FF0000").s().p("AnVHIQgni9BtkLQBukKDCi9QDCi9CmAAQCmAAAnC9QAnC9htEKQhtELjEC9QjBC9imAAQilAAgoi9g");
	this.shape.setTransform(410.7265,288.849,1.192,1.2015);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f().s("#FF0000").ss(1,1,1).p("AGQAAQAAELh1C9Qh1C9imAAQilAAh1i9Qh1i9AAkLQAAkKB1i9QB1i9ClAAQCmAAB1C9QB1C9AAEKg");
	this.shape_1.setTransform(363.3753,288.849,1.192,1.205,0,-4.3638,0);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#FF0000").s().p("AkaHIQh1i9AAkLQAAkKB1i9QB1i9ClAAQClAAB2C9QB1C9AAEKQAAELh1C9Qh2C9ilAAQilAAh1i9g");
	this.shape_2.setTransform(363.3753,288.849,1.192,1.205,0,-4.3638,0);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#FF0000").s().p("AitMIQgZAEgZAAQjGAAifjlQiejkgYlDQgZlCB7jkQB7jlDGAAQDHAACdDlIAaAnIAngnQDpjlDGAAQDHAAAvDlQAvDkiDFCQiDFDjqDkQjpDljFAAQgaAAgXgEg");
	this.shape_3.setTransform(391.642,288.85);

	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f("#FF0000").s().p("AivMOQgYAEgagBQjHABifjmQifjmgZlGQgYlEB7jnQB8jlDHAAQDIAACdDlIAbApIAngpQDrjlDHAAQDHAAAwDlQAvDniEFEQiEFGjrDmQjqDmjHgBQgZABgYgEg");
	this.shape_4.setTransform(391.6507,288.85);

	this.shape_5 = new cjs.Shape();
	this.shape_5.graphics.f("#FF0000").s().p("AivMTQgZADgaABQjIAAigjoQifjogalHQgYlHB8jnQB9joDIAAQDJAACeDoQAOAUAMAUIAogoQDsjoDIAAQDIAAAwDoQAwDniFFHQiEFHjsDoQjtDojHAAQgagBgXgDg");
	this.shape_5.setTransform(391.6496,288.85);

	this.shape_6 = new cjs.Shape();
	this.shape_6.graphics.f("#FF0000").s().p("AiwMYQgZAEgaAAQjKAAigjpQihjqgZlJQgZlJB9jpQB9jpDKAAQDJAACfDpIAbApIAngpQDujpDJAAQDKAAAwDpQAwDpiGFJQiFFJjtDqQjuDpjIAAQgaAAgXgEg");
	this.shape_6.setTransform(391.6514,288.875);

	this.shape_7 = new cjs.Shape();
	this.shape_7.graphics.f("#FF0000").s().p("AixMeQgZADgaAAQjLAAihjqQihjrgZlMQgalLB+jrQB+jqDKAAQDLAACgDqIAbAqIAngqQDujqDLAAQDKAAAxDqQAwDriGFLQiGFMjvDrQjuDqjJAAQgbAAgXgDg");
	this.shape_7.setTransform(391.6503,288.85);

	this.shape_8 = new cjs.Shape();
	this.shape_8.graphics.f("#FF0000").s().p("AiyMiQgZAEgbAAQjLAAiijsQiijsgalOQgZlNB+jsQB/jsDLAAQDMAAChDsIAaApIAogpQDwjsDLAAQDMAAAxDsQAwDsiHFNQiGFOjwDsQjwDsjKAAQgaAAgYgEg");
	this.shape_8.setTransform(391.659,288.875);

	this.shape_9 = new cjs.Shape();
	this.shape_9.graphics.f("#FF0000").s().p("AizMoQgZADgbAAQjMABijjuQijjugZlQQgalPB/juQB/jtDMAAQDNAACiDtQAOAVANAVQATgVAVgVQDxjtDMAAQDNAAAwDtQAxDuiHFPQiHFQjxDuQjxDujMgBQgaAAgYgDg");
	this.shape_9.setTransform(391.6625,288.85);

	this.shape_10 = new cjs.Shape();
	this.shape_10.graphics.f("#FF0000").s().p("Ai0MtQgZAEgbAAQjNAAikjwQikjvgZlSQgalRCAjwQB/jvDOAAQDNAACjDvIAbAqQATgVAVgVQDyjvDOAAQDOAAAwDvQAyDwiJFRQiIFSjyDvQjyDwjMAAQgbAAgYgEg");
	this.shape_10.setTransform(391.6712,288.875);

	this.shape_11 = new cjs.Shape();
	this.shape_11.graphics.f("#FF0000").s().p("Ai1MyQgZAEgbAAQjPAAikjxQiljxgZlUQgalTCAjxQCAjxDPAAQDPAACjDxQAOAUANAWQAUgWAVgUQDzjxDOAAQDPAAAxDxQAyDxiJFTQiJFUjzDxQjzDxjOAAQgbAAgYgEg");
	this.shape_11.setTransform(391.6701,288.875);

	this.shape_12 = new cjs.Shape();
	this.shape_12.graphics.f("#FF0000").s().p("Ai2M3QgZAEgbAAQjQAAiljyQimjygZlXQgalVCBjzQCBjyDPAAQDQAACkDyQAOAVANAWQAUgWAVgVQD1jyDPAAQDQAAAxDyQAyDziKFVQiJFXj1DyQj0DyjPAAQgbAAgYgEg");
	this.shape_12.setTransform(391.6621,288.85);

	this.shape_13 = new cjs.Shape();
	this.shape_13.graphics.f("#FF0000").s().p("Ai2M8QgaAEgbAAQjRAAimj0QimjzgalZQgalYCBj0QCCjzDQAAQDRAAClDzQAOAVANAWIApgrQD2jzDRAAQDRAAAxDzQAyD0iKFYQiKFZj2DzQj2D0jPAAQgbAAgYgEg");
	this.shape_13.setTransform(391.6708,288.875);

	this.shape_14 = new cjs.Shape();
	this.shape_14.graphics.f("#FF0000").s().p("Ai3NBQgaAEgbAAQjSAAinj1Qinj1galbQgalaCCj1QCCj1DSAAQDRAACmD1IAcArIApgrQD3j1DRAAQDSAAAyD1QAyD1iLFaQiKFbj3D1Qj3D1jRAAQgbAAgYgEg");
	this.shape_14.setTransform(391.6697,288.875);

	this.shape_15 = new cjs.Shape();
	this.shape_15.graphics.f("#FF0000").s().p("Ai4NHQgaAEgcAAQjSAAioj3Qioj3galdQgalcCCj3QCDj3DTAAQDTAACmD3QAPAVANAWQAUgWAVgVQD5j3DSAAQDTAAAyD3QAzD3iMFcQiLFdj5D3Qj4D3jSAAQgbAAgYgEg");
	this.shape_15.setTransform(391.6801,288.875);

	this.shape_16 = new cjs.Shape();
	this.shape_16.graphics.f("#FF0000").s().p("Ai5NMQgaAEgcAAQjUAAioj4Qipj5galfQgaleCDj4QCDj5DUAAQDUAACnD5IAcArQAUgWAWgVQD5j5DUAAQDUAAAyD5QAzD4iMFeQiMFfj6D5Qj5D4jTAAQgcAAgYgEg");
	this.shape_16.setTransform(391.6791,288.875);

	this.shape_17 = new cjs.Shape();
	this.shape_17.graphics.f("#FF0000").s().p("Ai6NRQgaAEgcAAQjVAAipj6Qiqj6galhQgalgCDj7QCEj5DVAAQDVAACoD5IAcAsIAqgsQD7j5DUAAQDWAAAyD5QAzD7iNFgQiNFhj6D6Qj7D6jUAAQgbAAgZgEg");
	this.shape_17.setTransform(391.6877,288.9);

	this.shape_18 = new cjs.Shape();
	this.shape_18.graphics.f("#FF0000").s().p("Ai7NWQgaAEgcAAQjWAAiqj7Qirj8galjQgbliCFj8QCFj7DWAAQDVAACpD7IAcAsIAqgsQD8j7DWAAQDWAAAzD7QAzD8iNFiQiOFjj8D8Qj8D7jUAAQgcAAgZgEg");
	this.shape_18.setTransform(391.6798,288.875);

	this.shape_19 = new cjs.Shape();
	this.shape_19.graphics.f("#FF0000").s().p("Ai8NbQgaAEgcAAQjXAAirj8Qisj+gallQgblkCFj9QCGj9DXAAQDXAACpD9QAPAVAOAXIAqgsQD9j9DXAAQDXAAAzD9QAzD9iOFkQiOFlj9D+Qj9D8jWAAQgcAAgZgEg");
	this.shape_19.setTransform(391.6787,288.875);

	this.shape_20 = new cjs.Shape();
	this.shape_20.graphics.f("#FF0000").s().p("Ai9NgQgaAEgcABQjYAAisj/Qisj+gbloQgblnCGj/QCGj+DYABQDYgBCqD+QAPAXAOAWIAqgtQD/j+DXABQDZgBAzD+QA0D/iPFnQiPFoj/D+Qj+D/jXAAQgcgBgZgEg");
	this.shape_20.setTransform(391.6874,288.9);

	this.shape_21 = new cjs.Shape();
	this.shape_21.graphics.f("#FF0000").s().p("Ai9NmQgbAEgcAAQjaAAiskAQitkAgblqQgblpCHkAQCGkADZAAQDZAACrEAQAPAWAOAXQAVgXAWgWQD/kADZAAQDZAAA0EAQA0EAiQFpQiPFqkAEAQj/EAjYAAQgdAAgYgEg");
	this.shape_21.setTransform(391.6909,288.875);

	this.shape_22 = new cjs.Shape();
	this.shape_22.graphics.f("#FF0000").s().p("Ai+NrQgbAEgdAAQjaAAitkBQiukDgblrQgblrCHkCQCHkBDbAAQDZAACsEBQAQAWANAXQAVgXAWgWQEBkBDaAAQDaAAA0EBQA0ECiQFrQiQFrkBEDQkBEBjZAAQgcAAgZgEg");
	this.shape_22.setTransform(391.6996,288.9);

	this.shape_23 = new cjs.Shape();
	this.shape_23.graphics.f("#FF0000").s().p("Ai/NwQgbAEgdAAQjbAAiukDQivkDgbluQgbltCIkDQCIkDDbAAQDbAACtEDQAPAWANAXQAVgXAXgWQECkDDbAAQDbAAA0EDQA0EDiRFtQiRFukCEDQkBEDjbAAQgcAAgZgEg");
	this.shape_23.setTransform(391.6985,288.875);

	this.shape_24 = new cjs.Shape();
	this.shape_24.graphics.f("#FF0000").s().p("AjBN1QgbAFgcgBQjdAAivkEQivkFgblwQgclvCJkFQCIkEDdAAQDbAACuEEQAPAWAOAYQAWgYAVgWQEEkEDcAAQDcAAA0EEQA1EFiSFvQiRFwkEEFQkDEEjbAAQgcABgagFg");
	this.shape_24.setTransform(391.7002,288.9);

	this.shape_25 = new cjs.Shape();
	this.shape_25.graphics.f("#FF0000").s().p("AjBN6QgbAEgdABQjdgBiwkFQixkHgblyQgblxCJkHQCJkFDdgBQDdABCvEFQAPAXAOAXQAVgXAWgXQEFkFDdgBQDdABA1EFQA1EHiTFxQiSFykEEHQkFEFjcABQgdgBgZgEg");
	this.shape_25.setTransform(391.6991,288.9);

	this.shape_26 = new cjs.Shape();
	this.shape_26.graphics.f("#FF0000").s().p("AjCN/QgcAFgdAAQjeAAixkIQixkHgbl1Qgcl0CKkHQCKkIDeAAQDeAACvEIQAQAWAOAYQAVgYAWgWQEGkIDeAAQDfAAA0EIQA2EHiUF0QiTF1kFEHQkGEIjdAAQgdAAgZgFg");
	this.shape_26.setTransform(391.7078,288.9);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.shape_2,p:{scaleX:1.192,scaleY:1.205,skewX:-4.3638,x:363.3753,y:288.849}},{t:this.shape_1,p:{scaleX:1.192,scaleY:1.205,skewX:-4.3638,x:363.3753,y:288.849}},{t:this.shape,p:{scaleX:1.192,scaleY:1.2015,x:410.7265,y:288.849}}]},264).to({state:[{t:this.shape_3}]},1).to({state:[{t:this.shape_4}]},1).to({state:[{t:this.shape_5}]},1).to({state:[{t:this.shape_6}]},1).to({state:[{t:this.shape_7}]},1).to({state:[{t:this.shape_8}]},1).to({state:[{t:this.shape_9}]},1).to({state:[{t:this.shape_10}]},1).to({state:[{t:this.shape_11}]},1).to({state:[{t:this.shape_12}]},1).to({state:[{t:this.shape_13}]},1).to({state:[{t:this.shape_14}]},1).to({state:[{t:this.shape_15}]},1).to({state:[{t:this.shape_16}]},1).to({state:[{t:this.shape_17}]},1).to({state:[{t:this.shape_18}]},1).to({state:[{t:this.shape_19}]},1).to({state:[{t:this.shape_20}]},1).to({state:[{t:this.shape_21}]},1).to({state:[{t:this.shape_22}]},1).to({state:[{t:this.shape_23}]},1).to({state:[{t:this.shape_24}]},1).to({state:[{t:this.shape_25}]},1).to({state:[{t:this.shape_26}]},1).to({state:[{t:this.shape_2,p:{scaleX:1.3481,scaleY:1.4069,skewX:-4.2269,x:359.7308,y:288.8981}},{t:this.shape_1,p:{scaleX:1.3481,scaleY:1.4069,skewX:-4.2269,x:359.7308,y:288.8981}},{t:this.shape,p:{scaleX:1.3481,scaleY:1.4031,x:413.298,y:288.8981}}]},1).to({state:[{t:this.shape_2,p:{scaleX:1.3481,scaleY:1.4069,skewX:-4.2269,x:359.7308,y:288.8981}},{t:this.shape_1,p:{scaleX:1.3481,scaleY:1.4069,skewX:-4.2269,x:359.7308,y:288.8981}},{t:this.shape,p:{scaleX:1.3481,scaleY:1.4031,x:413.298,y:288.8981}}]},1).to({state:[{t:this.shape_2,p:{scaleX:1.3481,scaleY:1.4069,skewX:-4.2269,x:359.7308,y:288.8981}},{t:this.shape_1,p:{scaleX:1.3481,scaleY:1.4069,skewX:-4.2269,x:359.7308,y:288.8981}},{t:this.shape,p:{scaleX:1.3481,scaleY:1.4031,x:413.298,y:288.8981}}]},1).to({state:[]},1).wait(216));

	// dogs
	this.instance_5 = new lib.minimini_dog();
	this.instance_5.setTransform(258.1,433.9,1,1,0,0,0,39.5,24.7);

	this.instance_6 = new lib.dog3();
	this.instance_6.setTransform(556.6,318.8,1,1,0,0,0,62.7,76.3);

	this.instance_7 = new lib.minidog();
	this.instance_7.setTransform(252.55,334.4,1,1,0,0,0,44.9,60.5);

	this.instance_8 = new lib.brodog();
	this.instance_8.setTransform(382.85,420.85,1,1,0,0,0,76,54.5);

	this.instance_9 = new lib.dog_aski();
	this.instance_9.setTransform(103,308,1,1,0,0,0,90,121);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.instance_9},{t:this.instance_8},{t:this.instance_7},{t:this.instance_6},{t:this.instance_5}]},120).to({state:[]},145).wait(243));

	// reka2
	this.instance_10 = new lib.reka3();
	this.instance_10.setTransform(-5,-444,0.5066,0.844);
	this.instance_10._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_10).wait(120).to({_off:false},0).wait(144).to({x:-106,y:-452},0).wait(25).to({_off:true},3).wait(216));

	// women
	this.instance_11 = new lib.women1();
	this.instance_11.setTransform(216.25,383.85,0.7474,0.5583,0,0,0,23.8,69);
	this.instance_11._off = true;

	this.instance_12 = new lib.Tween46("synched",0);
	this.instance_12.setTransform(445.25,150.2,0.9542,0.7429);
	this.instance_12._off = true;

	this.instance_13 = new lib.Tween47("synched",0);
	this.instance_13.setTransform(318.6,139.95,0.6804,0.6667);
	this.instance_13._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_11).wait(76).to({_off:false},0).wait(8).to({x:354.4,y:352.8},0).to({regY:69.1,scaleX:0.3847,scaleY:0.3791,x:389.65,y:156.55},35).to({_off:true},173).wait(216));
	this.timeline.addTween(cjs.Tween.get(this.instance_12).wait(378).to({_off:false},0).to({scaleX:0.9618,scaleY:0.7857,x:320.95,y:144.65},17).to({_off:true},1).wait(112));
	this.timeline.addTween(cjs.Tween.get(this.instance_13).wait(396).to({_off:false},0).wait(27).to({startPosition:0},0).wait(38).to({startPosition:0},0).wait(20).to({startPosition:0},0).wait(5).to({x:315.65,y:142.15},0).wait(20).to({startPosition:0},0).to({_off:true},1).wait(1));

	// men
	this.instance_14 = new lib.Tween51("synched",0);
	this.instance_14.setTransform(29.45,148.6,1,1.3309);
	this.instance_14._off = true;

	this.instance_15 = new lib.men_b("synched",0);
	this.instance_15.setTransform(273.45,143.8,1,1.2837);

	this.instance_16 = new lib.men2("synched",0);
	this.instance_16.setTransform(273.05,143.75,1,1,0,0,0,0.6,0);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.instance_14}]},461).to({state:[{t:this.instance_14}]},17).to({state:[{t:this.instance_15}]},3).to({state:[{t:this.instance_16}]},5).to({state:[{t:this.instance_16}]},20).to({state:[]},1).wait(1));
	this.timeline.addTween(cjs.Tween.get(this.instance_14).wait(461).to({_off:false},0).to({scaleY:1.2908,x:236.85,y:144.5},17).to({_off:true,scaleY:1.2837,x:273.45,y:143.8},3).wait(27));

	// text
	this.text = new cjs.Text("ברוכה הבא לבית החדש שלך גו'י", "25px 'Arial'");
	this.text.textAlign = "center";
	this.text.lineHeight = 30;
	this.text.lineWidth = 106;
	this.text.parent = this;
	this.text.setTransform(405.05,9.7);

	this.shape_27 = new cjs.Shape();
	this.shape_27.graphics.f().s("#FFFFFF").ss(1,1,1,3,true).p("ALyAAQAADCjcCKQjdCKk5AAQk4AAjdiKQjciKAAjCQAAjCDciKQDdiJE4AAQE5AADdCJQDcCKAADCg");
	this.shape_27.setTransform(403.8,72.0132,1,1.6693);

	this.shape_28 = new cjs.Shape();
	this.shape_28.graphics.f("#FFFFFF").s().p("AoVFMQjciKAAjCQAAjCDciKQDeiJE3AAQE4AADeCJQDcCKAADCQAADCjcCKQjeCKk4AAQk3AAjeiKg");
	this.shape_28.setTransform(403.8,72.0132,1,1.6693);

	this.shape_29 = new cjs.Shape();
	this.shape_29.graphics.f("#FFFFFF").s().p("ACCEhQgEgKAKgGQAMgGADAJQAEAIgKAIQgEADgEAAQgEAAgDgGgAgqEVQgEgKAKgGQAMgGAEAJQACAIgJAIQgEADgEAAQgEAAgDgGgABNESQgHgHAJgEQAJgFAGAIQAFAIgJADIgFABQgFAAgDgEgAAPEQQgHgHAIgHQAIgHAJAKQAIAKgJAEQgEACgDAAQgGAAgEgFgAA0EMQgFgGAHgFQAGgEAGAIQAFAHgIADIgEABQgEAAgDgEgAgIEEQgGgHAJgEQAHgEAFAHQAFAHgHAEIgFABQgFAAgDgEgACTD+QgFgIAIgFQAIgGAHAKQAGAJgJAEIgGABQgFAAgEgFgABjD6QgLgLANgLQANgLAMAQQANAPgPAGQgFACgFAAQgIAAgHgGgAgZD2QgGgIAJgFQAHgFAHAJQAGAJgJAEIgGABQgFAAgDgFgAC1DzQgIgJAKgIIAFgDQAGgCAGAFQACgGAIgDIABgBQANgGAEAKQAEAKgMAKQgIAHgGgEIgEAEQgFACgEAAQgGAAgGgGgAAfDvQgEgJAJgFQALgGADAHQACAIgIAHQgEADgDAAQgEAAgCgFgAg4DqQgJgJAKgJQAKgIAKAMQALAMgMAFQgEACgEAAQgHAAgFgFgAhlDnQgGgIAJgEQAJgEAFAHQAFAIgIAEIgGABQgEAAgEgEgADnDgQgFgIAIgFQAEgDADABIADgCQAKgFAFAIQAGAJgJAEIgFACQgBACgDABIgGABQgGAAgEgFgAEeDeQgKgLAMgKQANgLAMAPQANAPgOAHQgGACgEAAQgJAAgHgHgAiXDeQgDgJAJgFQAKgFADAHQADAHgIAHQgEADgDAAQgEAAgDgFgAhrDUQgDgFAEgDQAGgDADAGQAEAFgGACIgDABQgDAAgCgDgAigDDQgJgKAOgHQANgGAHALQAIAMgMAFQgEACgEAAQgHAAgGgHgAESDCQgEgJAJgFQAKgFADAHQACAHgIAHQgDADgDAAQgEAAgCgFgAieCiQgDgIAHgEQAJgEACAGQACAFgGAGQgEACgCAAQgDAAgCgDgAEkCNQgHgHAJgEQAGgDAEACQACAAADAEQACADgBADQgBADgEACIgFABQgFAAgDgEgAioCFQgDgFAFgEQAFgDAEAGQAEAGgGACIgDABQgEAAgCgDgAFCB5QgIgHAJgIQAIgHAJAKQAJALgKAEQgEACgDAAQgFAAgFgFgAiyBwQgIgHAJgHQAIgHAIAKQAJAKgKAEQgDACgDAAQgGAAgEgFgAi5BVIgFgBIgBgDQgDgFgFAAIAAAAIAAAAIgHACIgBABIABgBIAHgCIAAAAIAAAAQAFAAADAFIABADQACAGgGADQgIAEgHgHQgFgHAHgEQgjgMgfgQIgDgBQhyg6AAhUQAAhTByg8QByg7CiAAQCiAAByA7QBzA8AABTQAAAYgJAXQgOAfgiAbIADgCQALgFAFAJQAGAJgKAEQgIAEgGgGIgDACQgIADgGgGIgBAAQgDgEAAgDQAAgEAEgDIAAAAQADgCADgBIAAAAIABAAQADAAAEAEIAAAAIAAAAIAAAAIABACIABgBIgBABIgBgCIAAAAIAAAAIAAAAQgEgEgDAAIgBAAIAAAAQgDABgDACIAAAAQgEADAAAEQAAADADAEIABAAIgDACQgSAMgVALQhyA7iiAAQhmAAhTgYgAE8BRQgGgIAJgFQAFgEAEACQACgCAEgCQALgGAEAIQADAIgKAIQgEAEgEAAIgDABIgGABQgFAAgEgFg");
	this.shape_29.setTransform(240.55,117.448);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.shape_28},{t:this.shape_27},{t:this.text,p:{scaleY:1,x:405.05,y:9.7,text:"ברוכה הבא לבית החדש שלך גו'י",font:"25px 'Arial'",lineHeight:29.95,lineWidth:106}}]},396).to({state:[]},31).to({state:[{t:this.shape_29},{t:this.text,p:{scaleY:1.0174,x:240.6,y:92.5,text:"שלום",font:"24px 'Arial'",lineHeight:28.85,lineWidth:71}}]},59).to({state:[]},20).wait(2));

	// home
	this.text_1 = new cjs.Text("Adoption day", "16px 'Felix Titling'", "#202020");
	this.text_1.lineHeight = 21;
	this.text_1.lineWidth = 92;
	this.text_1.parent = this;
	this.text_1.setTransform(274.25,110,0.7147,0.9124);

	this.instance_17 = new lib.paw();
	this.instance_17.setTransform(424,161,0.0303,0.0248);

	this.instance_18 = new lib.ברוכיםהבאים();
	this.instance_18.setTransform(347.1,111,0.061,0.0357,0,-0.0245,180);

	this.instance_19 = new lib.CachedBmp_3();
	this.instance_19.setTransform(-77,-2.45,0.5,0.5);

	this.instance_20 = new lib.CachedBmp_4();
	this.instance_20.setTransform(-77,-2.45,0.5,0.5);

	this.instance_21 = new lib.CachedBmp_5();
	this.instance_21.setTransform(-77,-2.45,0.5,0.5);

	this.instance_22 = new lib.CachedBmp_6();
	this.instance_22.setTransform(-77,-2.45,0.5,0.5);

	this.instance_23 = new lib.CachedBmp_7();
	this.instance_23.setTransform(-77,-2.45,0.5,0.5);

	this.instance_24 = new lib.CachedBmp_8();
	this.instance_24.setTransform(-77,-2.45,0.5,0.5);

	this.instance_25 = new lib.CachedBmp_9();
	this.instance_25.setTransform(171.9,-11.25,0.5,0.5);

	this.instance_26 = new lib.shar();
	this.instance_26.setTransform(496,133.9,1,1,0,0,0,38.5,22.6);

	this.instance_27 = new lib.CachedBmp_10();
	this.instance_27.setTransform(171.9,-11.25,0.5,0.5);

	this.instance_28 = new lib.CachedBmp_11();
	this.instance_28.setTransform(171.9,-11.25,0.5,0.5);

	this.instance_29 = new lib.CachedBmp_12();
	this.instance_29.setTransform(171.9,-11.25,0.5,0.5);

	this.instance_30 = new lib.CachedBmp_13();
	this.instance_30.setTransform(171.9,-11.25,0.5,0.5);

	this.instance_31 = new lib.CachedBmp_14();
	this.instance_31.setTransform(171.9,-11.25,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.instance_19},{t:this.instance_18},{t:this.instance_17},{t:this.text_1}]},45).to({state:[{t:this.instance_20},{t:this.instance_18},{t:this.instance_17},{t:this.text_1}]},51).to({state:[{t:this.instance_21},{t:this.instance_18},{t:this.instance_17},{t:this.text_1}]},23).to({state:[]},2).to({state:[{t:this.instance_22},{t:this.instance_18},{t:this.instance_17},{t:this.text_1}]},171).to({state:[{t:this.instance_23},{t:this.instance_18},{t:this.instance_17},{t:this.text_1}]},18).to({state:[{t:this.instance_24},{t:this.instance_18},{t:this.instance_17},{t:this.text_1}]},15).to({state:[]},1).to({state:[{t:this.instance_25}]},27).to({state:[{t:this.instance_27},{t:this.instance_26}]},1).to({state:[{t:this.instance_28}]},7).to({state:[{t:this.instance_29}]},10).to({state:[{t:this.instance_30}]},4).to({state:[{t:this.instance_31}]},1).to({state:[]},131).wait(1));

	// car_r
	this.instance_32 = new lib.red_car();
	this.instance_32.setTransform(-32.35,332,1,1,0,0,0,137.8,65.7);
	this.instance_32._off = true;

	this.instance_33 = new lib.red_car_togedercopy1();
	this.instance_33.setTransform(180.3,439.4,0.4294,0.3963,0,0,0,184.8,54.8);

	this.instance_34 = new lib.red_carcopy();
	this.instance_34.setTransform(180,439.8,0.3862,0.4308,0,0,0,184.8,50.7);

	this.instance_35 = new lib.red_car_togeder();
	this.instance_35.setTransform(145.2,427.35,0.5522,0.5205,0,-1.3137,180,184.3,50.8);
	this.instance_35._off = true;

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.instance_32}]},4).to({state:[{t:this.instance_32}]},40).to({state:[{t:this.instance_32}]},1).to({state:[{t:this.instance_32}]},2).to({state:[{t:this.instance_32}]},4).to({state:[{t:this.instance_32}]},5).to({state:[{t:this.instance_32}]},18).to({state:[{t:this.instance_33,p:{regX:184.8,regY:54.8,scaleX:0.4294,scaleY:0.3963,skewX:0,skewY:0,x:180.3,y:439.4}}]},2).to({state:[{t:this.instance_32},{t:this.instance_34}]},43).to({state:[]},2).to({state:[{t:this.instance_35}]},171).to({state:[{t:this.instance_35}]},17).to({state:[{t:this.instance_35}]},15).to({state:[{t:this.instance_35}]},1).to({state:[{t:this.instance_35}]},1).to({state:[{t:this.instance_35}]},26).to({state:[{t:this.instance_35}]},2).to({state:[{t:this.instance_35}]},21).to({state:[{t:this.instance_33,p:{regX:210.2,regY:72.3,scaleX:0.3428,scaleY:0.33,skewX:18.5698,skewY:229.4792,x:498.2,y:167.65}}]},1).to({state:[]},131).wait(1));
	this.timeline.addTween(cjs.Tween.get(this.instance_32).wait(4).to({_off:false},0).to({scaleY:1.0029,skewX:4.355,x:646.6,y:323},40).wait(1).to({regX:137.5,regY:65.8,scaleX:0.3402,scaleY:0.4223,skewX:4.3512,x:-25.3,y:335.35},0).wait(2).to({skewX:19.3501,skewY:14.9993,x:-2.7,y:333.35},0).wait(4).to({regY:66.1,skewX:49.3502,skewY:45,x:-2.85,y:333.45},0).wait(5).to({regX:137.7,regY:66.2,skewX:64.3497,skewY:59.9985,x:1.05,y:360.2},0).to({regX:138,regY:66.4,scaleX:0.3401,skewX:4.3496,skewY:0,x:163.9,y:445.75},18).to({_off:true},2).wait(43).to({_off:false,skewX:4.3496},0).to({_off:true},2).wait(387));
	this.timeline.addTween(cjs.Tween.get(this.instance_35).wait(292).to({_off:false},0).to({regX:184.2,regY:50.7,scaleX:0.5521,scaleY:0.5204,skewX:28.6857,skewY:209.9986,x:96.7,y:439.25},17).to({x:46.65,y:405.7},15).wait(1).to({regX:184.3,regY:50.8,skewX:43.6861,skewY:224.9989,x:64.15,y:405.35},0).wait(1).to({regX:184.8,regY:50.6,scaleX:1,scaleY:1,skewX:0,skewY:180,x:455.95,y:232.95},0).to({x:137.7},26).wait(2).to({regX:184.7,scaleX:0.7749,scaleY:0.6336,x:660,y:240.95},0).to({regX:184.5,scaleX:0.3101,scaleY:0.4235,skewX:-6.3949,skewY:222.91,x:514,y:169.35},21).to({_off:true,regX:210.2,regY:72.3,scaleX:0.3428,scaleY:0.33,skewX:18.5698,skewY:229.4792,x:498.2,y:167.65},1).wait(132));

	// reka_1
	this.instance_36 = new lib.telavivsignremovebgpreview();
	this.instance_36.setTransform(482,74,0.2561,0.1849);

	this.instance_37 = new lib.Tween7("synched",42);
	this.instance_37.setTransform(279.2,62.05,1,1,0,0,0,-0.8,0);

	this.instance_38 = new lib.CachedBmp_15();
	this.instance_38.setTransform(-6.45,-4.95,0.5,0.5);

	this.instance_39 = new lib.CachedBmp_16();
	this.instance_39.setTransform(-4.6,51.15,0.5,0.5);

	this.instance_40 = new lib.CachedBmp_17();
	this.instance_40.setTransform(-4.6,51.15,0.5,0.5);

	this.instance_41 = new lib.CachedBmp_18();
	this.instance_41.setTransform(-4.6,51.15,0.5,0.5);

	this.instance_42 = new lib.CachedBmp_19();
	this.instance_42.setTransform(-4.6,51.15,0.5,0.5);

	this.instance_43 = new lib.CachedBmp_20();
	this.instance_43.setTransform(-4.6,51.15,0.5,0.5);

	this.instance_44 = new lib.CachedBmp_21();
	this.instance_44.setTransform(-4.6,51.15,0.5,0.5);

	this.instance_45 = new lib.CachedBmp_22();
	this.instance_45.setTransform(-4.6,51.15,0.5,0.5);

	this.shape_30 = new cjs.Shape();
	this.shape_30.graphics.f().s("#B2EDEA").ss(6,1,1).p("AprjRITXAAIAAGjIzXAAg");
	this.shape_30.setTransform(547,94.05);

	this.shape_31 = new cjs.Shape();
	this.shape_31.graphics.f("#B2EDEA").s().p("AprDSIAAmjITXAAIAAGjg");
	this.shape_31.setTransform(547,94.05);

	this.instance_46 = new lib.Tween44("synched",0);
	this.instance_46.setTransform(320,238.95);

	this.instance_47 = new lib.CachedBmp_23();
	this.instance_47.setTransform(-1.95,78.9,0.5,0.5);

	this.instance_48 = new lib.Tween45("synched",0);
	this.instance_48.setTransform(320,238.95);

	this.instance_49 = new lib.shar();
	this.instance_49.setTransform(496,134,1,1,0,0,0,38.5,22.6);

	this.instance_50 = new lib.CachedBmp_24();
	this.instance_50.setTransform(-1.95,78.9,0.5,0.5);

	this.instance_51 = new lib.CachedBmp_25();
	this.instance_51.setTransform(-1.95,78.9,0.5,0.5);

	this.instance_52 = new lib.CachedBmp_26();
	this.instance_52.setTransform(-1.95,78.9,0.5,0.5);

	this.instance_53 = new lib.CachedBmp_27();
	this.instance_53.setTransform(-1.95,78.9,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.instance_38},{t:this.instance_37,p:{x:279.2,y:62.05,startPosition:42}},{t:this.instance_36}]},4).to({state:[{t:this.instance_39},{t:this.instance_37,p:{x:282.15,y:76.95,startPosition:53}}]},41).to({state:[{t:this.instance_40},{t:this.instance_37,p:{x:282.15,y:76.95,startPosition:55}}]},2).to({state:[{t:this.instance_41},{t:this.instance_37,p:{x:282.15,y:76.95,startPosition:104}}]},49).to({state:[{t:this.instance_42},{t:this.instance_37,p:{x:282.15,y:76.95,startPosition:127}}]},23).to({state:[]},2).to({state:[{t:this.instance_43},{t:this.instance_37,p:{x:282.15,y:76.95,startPosition:127}}]},171).to({state:[{t:this.instance_44},{t:this.instance_37,p:{x:282.15,y:76.95,startPosition:145}}]},18).to({state:[{t:this.instance_45},{t:this.instance_37,p:{x:282.15,y:76.95,startPosition:160}}]},15).to({state:[{t:this.instance_46,p:{x:320,y:238.95}},{t:this.shape_31,p:{x:547,y:94.05}},{t:this.shape_30,p:{x:547,y:94.05}}]},1).to({state:[{t:this.instance_46,p:{x:323.45,y:240.9}},{t:this.shape_31,p:{x:550.45,y:96}},{t:this.shape_30,p:{x:550.45,y:96}}]},26).to({state:[{t:this.instance_48},{t:this.instance_47}]},1).to({state:[{t:this.instance_48},{t:this.instance_50},{t:this.instance_49,p:{scaleY:1,y:134}}]},8).to({state:[{t:this.instance_48},{t:this.instance_51},{t:this.instance_49,p:{scaleY:1,y:134}}]},9).to({state:[{t:this.instance_48},{t:this.instance_52},{t:this.instance_49,p:{scaleY:0.6785,y:126.75}}]},1).to({state:[{t:this.instance_48},{t:this.instance_53},{t:this.instance_49,p:{scaleY:0.2903,y:117.95}}]},1).to({state:[]},135).wait(1));

	// button
	this.start = new lib.start_button();
	this.start.name = "start";
	this.start.setTransform(191.4,159.55);
	new cjs.ButtonHelper(this.start, 0, 1, 2, false, new lib.start_button(), 3);

	this.timeline.addTween(cjs.Tween.get(this.start).to({_off:true},4).wait(504));

	this._renderFirstFrame();

}).prototype = p = new lib.AnMovieClip();
p.nominalBounds = new cjs.Rectangle(196.8,-212,640.9000000000001,726.7);
// library properties:
lib.properties = {
	id: 'F73BA7F49FBE34428EB3953053DA0C73',
	width: 640,
	height: 480,
	fps: 24,
	color: "#99FFFF",
	opacity: 1.00,
	manifest: [
		{src:"images/ani_mid_atlas_1.png?1628767254114", id:"ani_mid_atlas_1"},
		{src:"images/ani_mid_atlas_2.png?1628767254114", id:"ani_mid_atlas_2"},
		{src:"images/ani_mid_atlas_3.png?1628767254114", id:"ani_mid_atlas_3"},
		{src:"images/ani_mid_atlas_4.png?1628767254115", id:"ani_mid_atlas_4"},
		{src:"images/ani_mid_atlas_5.png?1628767254115", id:"ani_mid_atlas_5"},
		{src:"images/ani_mid_atlas_6.png?1628767254115", id:"ani_mid_atlas_6"},
		{src:"images/ani_mid_atlas_7.png?1628767254115", id:"ani_mid_atlas_7"},
		{src:"images/ani_mid_atlas_8.png?1628767254115", id:"ani_mid_atlas_8"},
		{src:"images/ani_mid_atlas_9.png?1628767254115", id:"ani_mid_atlas_9"},
		{src:"images/ani_mid_atlas_10.png?1628767254116", id:"ani_mid_atlas_10"},
		{src:"images/ani_mid_atlas_11.png?1628767254116", id:"ani_mid_atlas_11"},
		{src:"sounds/ADogIsAFriendGreatSongForAllDogLoversmp3cutnet.mp3?1628767254253", id:"ADogIsAFriendGreatSongForAllDogLoversmp3cutnet"}
	],
	preloads: []
};



// bootstrap callback support:

(lib.Stage = function(canvas) {
	createjs.Stage.call(this, canvas);
}).prototype = p = new createjs.Stage();

p.setAutoPlay = function(autoPlay) {
	this.tickEnabled = autoPlay;
}
p.play = function() { this.tickEnabled = true; this.getChildAt(0).gotoAndPlay(this.getTimelinePosition()) }
p.stop = function(ms) { if(ms) this.seek(ms); this.tickEnabled = false; }
p.seek = function(ms) { this.tickEnabled = true; this.getChildAt(0).gotoAndStop(lib.properties.fps * ms / 1000); }
p.getDuration = function() { return this.getChildAt(0).totalFrames / lib.properties.fps * 1000; }

p.getTimelinePosition = function() { return this.getChildAt(0).currentFrame / lib.properties.fps * 1000; }

an.bootcompsLoaded = an.bootcompsLoaded || [];
if(!an.bootstrapListeners) {
	an.bootstrapListeners=[];
}

an.bootstrapCallback=function(fnCallback) {
	an.bootstrapListeners.push(fnCallback);
	if(an.bootcompsLoaded.length > 0) {
		for(var i=0; i<an.bootcompsLoaded.length; ++i) {
			fnCallback(an.bootcompsLoaded[i]);
		}
	}
};

an.compositions = an.compositions || {};
an.compositions['F73BA7F49FBE34428EB3953053DA0C73'] = {
	getStage: function() { return exportRoot.stage; },
	getLibrary: function() { return lib; },
	getSpriteSheet: function() { return ss; },
	getImages: function() { return img; }
};

an.compositionLoaded = function(id) {
	an.bootcompsLoaded.push(id);
	for(var j=0; j<an.bootstrapListeners.length; j++) {
		an.bootstrapListeners[j](id);
	}
}

an.getComposition = function(id) {
	return an.compositions[id];
}


an.makeResponsive = function(isResp, respDim, isScale, scaleType, domContainers) {		
	var lastW, lastH, lastS=1;		
	window.addEventListener('resize', resizeCanvas);		
	resizeCanvas();		
	function resizeCanvas() {			
		var w = lib.properties.width, h = lib.properties.height;			
		var iw = window.innerWidth, ih=window.innerHeight;			
		var pRatio = window.devicePixelRatio || 1, xRatio=iw/w, yRatio=ih/h, sRatio=1;			
		if(isResp) {                
			if((respDim=='width'&&lastW==iw) || (respDim=='height'&&lastH==ih)) {                    
				sRatio = lastS;                
			}				
			else if(!isScale) {					
				if(iw<w || ih<h)						
					sRatio = Math.min(xRatio, yRatio);				
			}				
			else if(scaleType==1) {					
				sRatio = Math.min(xRatio, yRatio);				
			}				
			else if(scaleType==2) {					
				sRatio = Math.max(xRatio, yRatio);				
			}			
		}
		domContainers[0].width = w * pRatio * sRatio;			
		domContainers[0].height = h * pRatio * sRatio;
		domContainers.forEach(function(container) {				
			container.style.width = w * sRatio + 'px';				
			container.style.height = h * sRatio + 'px';			
		});
		stage.scaleX = pRatio*sRatio;			
		stage.scaleY = pRatio*sRatio;
		lastW = iw; lastH = ih; lastS = sRatio;            
		stage.tickOnUpdate = false;            
		stage.update();            
		stage.tickOnUpdate = true;		
	}
}
an.handleSoundStreamOnTick = function(event) {
	if(!event.paused){
		var stageChild = stage.getChildAt(0);
		if(!stageChild.paused || stageChild.ignorePause){
			stageChild.syncStreamSounds();
		}
	}
}
an.handleFilterCache = function(event) {
	if(!event.paused){
		var target = event.target;
		if(target){
			if(target.filterCacheList){
				for(var index = 0; index < target.filterCacheList.length ; index++){
					var cacheInst = target.filterCacheList[index];
					if((cacheInst.startFrame <= target.currentFrame) && (target.currentFrame <= cacheInst.endFrame)){
						cacheInst.instance.cache(cacheInst.x, cacheInst.y, cacheInst.w, cacheInst.h);
					}
				}
			}
		}
	}
}


})(createjs = createjs||{}, AdobeAn = AdobeAn||{});
var createjs, AdobeAn;