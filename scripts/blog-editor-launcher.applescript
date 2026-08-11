use scripting additions

property projectPath : "/Users/fanluyao/portfolio"
property targetURL : "http://127.0.0.1:4321/keystatic"

on run
	set starterPath to projectPath & "/scripts/start-blog-editor.sh"
	set launchToken to do shell script "/bin/date +%s"
	
	try
		do shell script ("/bin/zsh " & (quoted form of starterPath))
	on error errorMessage
		display dialog errorMessage buttons {"知道了"} default button "知道了" with title "个人博客文章编辑" with icon caution
		return
	end try
	
	open location targetURL & "?launch=" & launchToken
end run
