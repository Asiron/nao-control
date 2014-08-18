//=require jquery
//=require jquery_mobile
//=require event_emitter
//=require roslib
//=require mjpegcanvas

$(document).ready(function() {

	var viewport = {
	    width  : $(window).width(),
	    height : $(window).height()
	};

	function initJPEGStreamer() {

		var mjpegWidth  = 320;
		var mjpegHeight = 240 

		if (viewport.width < mjpegWidth) {
			mjpegWidth = viewport.width;
		}

		if (viewport.height < mjpegHeight) {
			mjpegHeight = viewport.height;
		};


     	var viewer = new MJPEGCANVAS.Viewer({
			divID : 'mjpeg',
			host : 'localhost',
			width : mjpegWidth * 0.80,
			height : mjpegHeight * 0.80,
			topic : '/camera/image_raw',	
			port: 36000
    	});
	}

	initJPEGStreamer();

	var connection  = null;
	var cmdVelTopic = null;
	var speechTopic = null;
	var isConnected = false;

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

	$("#flip-10").on( "slidestop", function( event, ui ) {} );
	$("#flip-10").slider({
  		stop: function( event, ui ) {

  			if (isConnected == false) {
	  			var hostname = 'ws://' + $("#textinput-s").val();
	  			console.log(hostname);
	  			try {
		  			connection = new ROSLIB.Ros({
		  				url : hostname
		  			});
			  		cmdVelTopic = new ROSLIB.Topic({
					    ros : connection,
					    name : '/cmd_vel',
					    messageType : 'geometry_msgs/Twist'
				    });
				    speechTopic = new ROSLIB.Topic({
				    	ros : connection,
				    	name : '/speech',
				    	messageType : 'std_msgs/String',
				    });
				    isConnected = true;
				    callStiffness(connection, true);

		  		} catch (err) {
		  			console.log("Exception caugth");
		  		}
		  		isConnected = true;
		  	} else {
		  		cmdVelTopic.publish(stop);
		  		callStiffness(connection, false);
		  		connection.close();
		  		isConnected = false;
		  	}
		}
	});
});