class PagesController < ApplicationController
  def index

  	eth_interface = %x(ifconfig eth0)
	@local_ip = (eth_interface.match(/inet addr:(\d*\.\d*\.\d*\.\d*)/)[1] if eth_interface) || "localhost"
	@local_ip = @local_ip + ':9090'
	#@local_ip = "localhost:9090"
  end

  def pdfs

  end
end