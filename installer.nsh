!include "MUI2.nsh"
!include "LogicLib.nsh"

; Define language codes
!define LANG_ENGLISH 1033
!define LANG_JAPANESE 1041

!macro customHeader
  !include "FileFunc.nsh"
!macroend

!macro customInit
  Var /GLOBAL existingInstallation
  ReadRegStr $existingInstallation HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${UNINSTALL_APP_KEY}" "UninstallString"

  ; Get the system language
  System::Call 'kernel32::GetUserDefaultUILanguage() i.r0'
  
  ; Set language based on system language
  ${If} $0 == 1041 ; Japanese language code
    StrCpy $LANGUAGE ${LANG_JAPANESE}
  ${Else}
    StrCpy $LANGUAGE ${LANG_ENGLISH}
  ${EndIf}

!macroend


!macro customInstall
  SetOutPath "$INSTDIR"
  FileOpen $0 "$INSTDIR\install.log" w
  FileWrite $0 "Installation started.$\r$\n"

  ${If} $existingInstallation != ""
    FileWrite $0 "Check existing programe.$\r$\n"

    ; Get the system language
    System::Call 'kernel32::GetUserDefaultUILanguage() i.r0'
    ; Set up language-specific messages
    ${If} $0 == 1041 ; Japanese language code
      MessageBox MB_YESNO “アプリケーションはすでにインストールされています。再インストールしますか？" IDYES update IDNO abort
    ${Else}
      MessageBox MB_YESNO "The application is already installed. Do you want to reinstall?" IDYES update IDNO abort
    ${EndIf}
    update:
      ; Perform update actions here if needed
      Goto installationContinue
    abort:
      Quit
    installationContinue:
    ; Custom install actions
    FileWrite $0 "Custom install none error.$\r$\n"
  ${EndIf}

  FileWrite $0 "Custom install actions performed.$\r$\n"
  ; Enable basic logging for installation

  FileClose $0
!macroend

!macro customUnInstall
  ; Close the application if it's running
  nsExec::Exec 'taskkill /F /IM "${PRODUCT_FILENAME}" /T'
  Sleep 2000
  
  ; Remove leftover files
  RMDir /r "$INSTDIR"
  
  ; Remove Start Menu shortcut
  Delete "$SMPROGRAMS\${PRODUCT_NAME}.lnk"
  
  ; Remove Desktop shortcut
  Delete "$DESKTOP\${PRODUCT_NAME}.lnk"
  
  ; Remove registry keys
  DeleteRegKey HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_NAME}"
  DeleteRegKey HKCU "Software\${PRODUCT_NAME}"

  ; Enable basic logging for uninstallation
  SetOutPath "$INSTDIR"
  FileOpen $0 "$INSTDIR\uninstall.log" w
  FileWrite $0 "Uninstallation started.\r\n"
!macroend

!macro customWelcomePage
  # Welcome Page is not added by default for installer.
  !define MUI_WELCOMEPAGE_TITLE "早楽経営管理よこそ〜"
  !insertMacro MUI_PAGE_WELCOME
!macroend

