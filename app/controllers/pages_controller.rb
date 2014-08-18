class PagesController < ApplicationController
  def index
	@local_ip = %x(ifconfig en0).match(/inet (\d*\.\d*\.\d*\.\d*)/)[1] || "localhost"
	@local_ip = @local_ip + ':9090'
  end

  def pdfs

  end
end