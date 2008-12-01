# Methods added to this helper will be available to all templates in the application.
module ApplicationHelper
  def gmap_api_include
    hostname = request.env['SERVER_NAME']
    ipaddr = Socket::getaddrinfo(hostname, nil, Socket::AF_UNSPEC)[0][3]
    if hostname == "localhost"
      @key = ""
    elsif ipaddr == "192.168.1.24"
      @key = "ABQIAAAAFWWhd6xu7eDT15nkp1sQQxShIzeEU-iyoJqgXliLNpYUmP3RABT46jIxuPKRs-Ilu1blIEPxLJ5dfA"
    else
      @key = "ABQIAAAAFWWhd6xu7eDT15nkp1sQQxQ2ZspTbS5XvquBQmPB_A0jTVxSphTj4\
c2GeTMxKQOZQ-0bRpDwUaiQaQ"
    end
    "<script src=\"http://maps.google.co.jp/maps?file=api&amp;v=2&amp;key=#{@key}\" type=\"text/javascript\"></script>"
  end
end
