//=require jquery
//=require jquery_mobile
//=require event_emitter
//=require roslib
//=require mjpegcanvas

$(document).ready(function() {

	$("#mjpeg").hide(0);

	var viewport = {
	    width  : $(window).width(),
	    height : $(window).height()
	};

	var robotPrefix = "";

	function initJPEGStreamer(hostname) {	
		if (mjpegViewerHostname != hostname) {
			var mjpegWidth  = 320;
			var mjpegHeight = 240 

			if (viewport.width < mjpegWidth) {
				mjpegWidth = viewport.width;
			}

			if (viewport.height < mjpegHeight) {
				mjpegHeight = viewport.height;
			};
			delete mjpegViewer;
			deleteCanvases()
	     	mjpegViewer = new MJPEGCANVAS.Viewer({
				divID : 'mjpeg',
				host : hostname,
				width : mjpegWidth * 0.80,
				height : mjpegHeight * 0.80,
				topic : '/nao_robot/camera/top/camera/image_raw',	
				port: 36000
    		});	
    		mjpegViewerHostname = hostname;
		}
	    $("#mjpeg").show(1500);	
	}

	function deinitJPEGStreamer () {
		$("#mjpeg").hide(1500);
	}

	function deleteCanvases() {
		var canvas = document.getElementById("mjpeg");
		while (canvas.children[1]) {
    		canvas.removeChild(canvas.children[1]);
		}
	}

	var mjpegViewerHostname = null;
	var mjpegViewer = null;
	var connection  = null;
	var cmdVelTopic = null;
	var speechTopic = null;
	var isConnected = false;
	var bodyPoseActionClient = null;

	function callStiffness(connection, enable) {

		var arg = '/body_stiffness/enable';

		if (enable == false) {
			arg = '/body_stiffness/disable';
		}

		var jointStiffness = new ROSLIB.Service({
			ros: connection,
			name: arg,
			serviceType: arg
		});

		var request = new ROSLIB.ServiceRequest({
		});
		jointStiffness.callService(request, function(){});
	}

	function createBodyPoseGoal(name) {
		var goal_speed = parseFloat($("#posture_speed-s").val());


		return new ROSLIB.Goal({
			actionClient : bodyPoseActionClient,
			goalMessage : {
				posture_name : name,
				speed : goal_speed
			}
		});
	}

	var stop = new ROSLIB.Message({
		linear : {
	      x : 0.0,
	      y : 0.0,
	      z : 0.0
	    },
	    angular : {
	      x : 0.0,
	      y : 0.0,
	      z : 0.0
	    }
	})

	var goForward = new ROSLIB.Message({
	    linear : {
	      x : 1.0,
	      y : 0.0,
	      z : 0.0
	    },
	    angular : {
	      x : 0.0,
	      y : 0.0,
	      z : 0.0
	    }
	  });

	var goBackwards = new ROSLIB.Message({
	    linear : {
	      x : -1.0,
	      y : 0.0,
	      z : 0.0
	    },
	    angular : {
	      x : 0.0,
	      y : 0.0,
	      z : 0.0
	    }
	  });

	var turnLeft = new ROSLIB.Message({
	    linear : {
	      x : 1.0,
	      y : 0.0,
	      z : 0.0
	    },
	    angular : {
	      x : 0.0,
	      y : 0.0,
	      z : 1.0
	    }
	  });

	var turnRight = new ROSLIB.Message({
	    linear : {
	      x : 1.0,
	      y : 0.0,
	      z : 0.0
	    },
	    angular : {
	      x : 0.0,
	      y : 0.0,
	      z : -1.0
	    }
	  });

	$("#forward_btn").click(function() {
		if (isConnected == true) {
			cmdVelTopic.publish(goForward);
		}
	});

	$("#backward_btn").click(function() {
		if (isConnected == true) {
			cmdVelTopic.publish(goBackwards);
		}
	});

	$("#left_btn").click(function() {
		if (isConnected == true) {
			cmdVelTopic.publish(turnLeft);
		}
	});

	$("#right_btn").click(function() {
		if (isConnected == true) {
			cmdVelTopic.publish(turnRight);
		}
	});

	$("#stop_btn").click(function() {
		if (isConnected == true) {
			cmdVelTopic.publish(stop);
		}
	});

	$("#send_message_btn").click(function() {
		if (isConnected == true) {
			var msg = $("#message_input").val();
			var speechMessage = new ROSLIB.Message({data : msg});
			speechTopic.publish(speechMessage);
		}
	});

	$("#stand_init_btn").click(function() {
		if (isConnected == true) {
			createBodyPoseGoal("StandInit").send();
		}
	});

	$("#crouch_btn").click(function() {
		if (isConnected == true) {
			createBodyPoseGoal("Crouch").send();
		}
	});

	$("#sit_btn").click(function() {
		if (isConnected == true) {
			createBodyPoseGoal("Sit").send();
		}
	});

	$("#stand_btn").click(function() {
		if (isConnected == true) {
			createBodyPoseGoal("Stand").send();
		}
	});

	$("#stand_zero_btn").click(function() {
		if (isConnected == true) {
			createBodyPoseGoal("StandZero").send();
		}
	});

	$("#sit_relax_btn").click(function() {
		if (isConnected == true) {
			createBodyPoseGoal("SitRelax").send();
		}
	});

	$("#lying_belly_btn").click(function() {
		if (isConnected == true) {
			createBodyPoseGoal("LyingBelly").send();
		}
	});

	$("#lying_back_btn").click(function() {
		if (isConnected == true) {
			createBodyPoseGoal("LyingBack").send();
		}
	});



	$("#flip-10").on( "slidestop", function( event, ui ) {} );
	$("#flip-10").slider({
		animate: "fast",
  		stop: function( event, ui ) {

  			if (isConnected == false) {
	  			var fullHostname = $("#textinput-s").val();
	  			var index = fullHostname.search(":");
	  			var ip   = fullHostname.substr(0, index);
	  			var port = fullHostname.substr(index+1, fullHostname.length);

	  			robotPrefix = $("#robotprefix-s").val();

	  			console.log('ws://' + fullHostname);
	  			try {
		  			connection = new ROSLIB.Ros({
		  				url : 'ws://' + fullHostname
		  			});
			  		cmdVelTopic = new ROSLIB.Topic({
					    ros : connection,
					    name : robotPrefix + '/cmd_vel',
					    messageType : 'geometry_msgs/Twist'
				    });
				    speechTopic = new ROSLIB.Topic({
				    	ros : connection,
				    	name : robotPrefix +'/speech',
				    	messageType : 'std_msgs/String',
				    });
				    isConnected = true;
				    callStiffness(connection, true);
				    bodyPoseActionClient = new ROSLIB.ActionClient({
				    	ros : connection,
				    	serverName : robotPrefix + '/body_pose_naoqi',
				    	actionName : 'naoqi_msgs/BodyPoseWithSpeedAction',
				    	timeout : 3
				    });
				    initJPEGStreamer(ip);
		  		} catch (err) {
		  			console.log("Exception caugth");
		  		}
		  		isConnected = true;
		  	} else {
		  		cmdVelTopic.publish(stop);
		  		callStiffness(connection, false);
		  		connection.close();
		  		isConnected = false;
		  		deinitJPEGStreamer();
		  	}
		}
	});
});