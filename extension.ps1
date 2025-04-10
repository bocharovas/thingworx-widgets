#$ErrorActionPreference = "Stop"
$PowershellUrl = "https://github.com/PowerShell/PowerShell/releases/download/v7.2.0/PowerShell-7.2.0-win-x64.msi"

$twxUser = "Administrator"
$twxPassword = "ch@ngMe@F1rstL0gon"
$twxUrl = "http://localhost:8080/Thingworx"
#$twxPassword = "eutOBGpDV8LCn5YK"
#$twxUrl = "https://mobilesrv.digitaltwin.ru/Thingworx"
$twxExtensionName = "ProjectsWidgets"

### Functions
function CheckPowershellVersion {

	if (($PSVersionTable.PSVersion).Major -lt 7) {
		$yes = New-Object System.Management.Automation.Host.ChoiceDescription "&Yes","Automatically download and install newest powershell version."
		$no = New-Object System.Management.Automation.Host.ChoiceDescription "&No","Stop execution and manually install powershell."
		$options = [System.Management.Automation.Host.ChoiceDescription[]]($yes, $no)
		$title = RedText -Message "Needed Powershell version 7.0 or greater"
		$message = RedText -Message "Do you want to download and install latest version of powershell?"
		$result = $host.ui.PromptForChoice($title, $message, $options, 1)
		
		switch ($result) {
			0{
				GreenText -Message "Downloading latest powershell version"
				Invoke-WebRequest -Uri -SkipCertificateCheck $PowershellUrl -OutFile powershell.msi
				GreenText -Message "Installing powershell"
				Start-Process powershell.msi -ArgumentList "/quiet /passive" -Wait
				RedText -Message "Please relaunch this script in newly installed powershell!"
				exit 1
			}1{
				GreenText -Message "Please install latest powershell version manually!"
				GreenText -Message $PowershellUrl
				exit 1
			}
		}
	}
	
}

function GreenText {
	
	param (
		[string]$Message,
		[string]$Symbols = ">>>"
	)
	
	Write-Host $Symbols" " -NoNewLine
    Write-Host $Message -ForegroundColor Green
	
}

function DarkGreenText {
	
	param (
		[string]$Message,
		[string]$Symbols = ">>>"
	)
	
	Write-Host $Symbols" " -NoNewLine
    Write-Host $Message -ForegroundColor DarkGreen
	
}

function RedText {
	
	param (
		[string]$Message,
		[string]$Symbols = ">>>"
	)
	
	Write-Host $Symbols" " -NoNewLine
    Write-Host $Message -ForegroundColor Red
	
}

function Test-CommandExists {

	Param (
		$command
	)

	Try {if(Get-Command $Command){RETURN $true}}
	Catch {RETURN $false}

}

function CheckGradle {
	
	if (Test-CommandExists -Command gradle) {
	}
	else {
		RedText -Message "Please set gradle bin path manually"
		RedText -Message "BuildTwxExtension -GradleBin <path>"
		exit 1
	}
}

function BuildTwxExtension {
	
	param (
		[ValidateNotNullOrEmpty()]
		[string]$GradleBin = "gradle"
	)
	
	GreenText -Message "Build extension"
	Start-Process -FilePath $GradleBin -ArgumentList "clean build" -Wait
	
}

function GetTwxExtensionList {

	((Invoke-WebRequest -SkipCertificateCheck -Method "GET" `
	    -Uri "$twxUrl/ExtensionPackages" `
		-Headers @{"Authorization" = "Basic $Credential";"Accept" = "application/json";}).Content `
		| ConvertFrom-Json).rows.name

}

function RemoveTwxExtension {
	
	[CmdletBinding()]
	param (
		[ValidateNotNullOrEmpty()]
		[string]$ExtensionName
	)
	
	GreenText -Message "Remove old $ExtensionName extension" -Symbols ">>>>>"
	Invoke-WebRequest -SkipCertificateCheck -Method "POST" -Uri `
		"$twxUrl/Subsystems/PlatformSubsystem/Services/DeleteExtensionPackage?packageName=$ExtensionName" `
		-Headers @{"Authorization" = "Basic $Credential";"Accept" = "application/json";"Content-Type" = "application/json";} `
		> $null
	
}

function UploadTwxExtension {
	
	$currentPath = (Get-Location).Path
	$currentDir = Split-Path -Path $currentPath -Leaf

	GreenText -Message "Upload new $ExtensionName extension" -Symbols ">>>>>"
	$filePath = "$currentPath\build\distributions\$currentDir.zip"
	$fileForm = @{ file = Get-Item $filePath }
	Invoke-WebRequest -SkipCertificateCheck -Method "POST" `
		-Uri "$twxUrl/ExtensionPackageUploader" `
		-Form $fileForm -Headers @{"Authorization" = "Basic $Credential";"Accept" = "application/json";"X-XSRF-TOKEN" = "TWX-XSRF-TOKEN-VALUE";} `
		> $null
}

function CheckTwxExtension {
	
	[CmdletBinding()]
	param (
		[ValidateNotNullOrEmpty()]
		[string]$ExtensionName
	)
	
	GreenText -Message "Check $ExtensionName extension is installed"
	$Extensionlist = GetTwxExtensionList
	if ($Extensionlist -contains $ExtensionName){
		DarkGreenText -Message "Extension $ExtensionName installed" -Symbols "+++++"
		RemoveTwxExtension -ExtensionName $ExtensionName
		UploadTwxExtension
	}
	else {
		DarkGreenText -Message "Extension $ExtensionName not installed" -Symbols "+++++"
		UploadTwxExtension
	}
	
}
### Functions

CheckPowershellVersion
CheckGradle
$Credential = [System.Convert]::ToBase64String([System.Text.Encoding]::ASCII.GetBytes("$($twxUser):$($twxPassword)"))
BuildTwxExtension
CheckTwxExtension -ExtensionName $twxExtensionName