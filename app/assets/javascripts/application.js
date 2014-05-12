//=require jquery
//=require jquery_mobile
//=require event_emitter
//=require roslib

$(document).ready(function() {

	var connection = null;
	var topic 	   = null;

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
			topic.publish(goForward);
		}
	})

	$("#backward_btn").click(function() {
		if (isConnected == true) {
			topic.publish(goBackwards);
		}
	})

	$("#left_btn").click(function() {
		if (isConnected == true) {
			topic.publish(turnLeft);
		}
	})

	$("#right_btn").click(function() {
		if (isConnected == true) {
			topic.publish(turnRight);
		}
	})	

	$("#stop_btn").click(function() {
		if (isConnected == true) {
			topic.publish(stop);
		}
	})	

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
			  		topic = new ROSLIB.Topic({
					    ros : connection,
					    name : '/cmd_vel',
					    messageType : 'geometry_msgs/Twist'
				    });
				    isConnected = true;
				    callStiffness(connection, true);

		  		} catch (err) {
		  			console.log("Exception caugth");
		  		}
		  		isConnected = true;
		  	} else {
		  		topic.publish(stop);
		  		callStiffness(connection, false);
		  		connection.close();
		  		isConnected = false;
		  	}
		}
	});
});