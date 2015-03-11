class PagesController < ApplicationController
  def index
	@local_ip = %x(ifconfig eth0).match(/inet addr:(\d*\.\d*\.\d*\.\d*)/)[1] || "localhost"
	@local_ip = @local_ip + ':9090'
	#@local_ip = "localhost:9090"
  end

  def pdfs

  end
end