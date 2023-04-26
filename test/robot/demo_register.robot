*** Settings ***
Library             SeleniumLibrary

Test Teardown       Close All Browsers


*** Test Cases ***
TC1-1 168
    [Tags]    all input
    Open Browser    https://dev.d2g12c5od8o9j.amplifyapp.com/signup    chrome
    Maximize Browser Window

    Wait Until Element Is Visible    //*[@class="MuiBox-root mui-style-5ul8ui"] 
    
    #Input Email : <empty>

    #Input Password : 12345
    Input text    //*[@name="password"]    12345
    ${password}=    Get Value    //*[@name="password"]
    Should Be Equal    ${password}    12345

    #Input Confirm Password : 12345
    Input text    //*[@name="confirmPassword"]    12345
    ${confirmPassword}=    Get Value    //*[@name="confirmPassword"]
    Should Be Equal    ${confirmPassword}    12345

    #password match
    Should Be Equal    ${confirmPassword}    ${password}



    #Signup Button
    Click Element    //*[@class="MuiTypography-root MuiTypography-h6 mui-style-haplq4"]

    #verrify error message
    Wait Until Page Contains  Please enter a valid email address  timeout=3s

TC1-2 268
    [Tags]    all input
    Open Browser    https://dev.d2g12c5od8o9j.amplifyapp.com/signup    chrome
    Maximize Browser Window

    Wait Until Element Is Visible    //*[@class="MuiBox-root mui-style-5ul8ui"] 
    
    #Input Email : sernlnwza007
    Input text    //*[@name="email"]    sernlnwza007
    ${email}=    Get Value    //*[@name="email"]
    Should Be Equal    ${email}    sernlnwza007

    #Input Password : 12345
    Input text    //*[@name="password"]    12345
    ${password}=    Get Value    //*[@name="password"]
    Should Be Equal    ${password}    12345

    #Input Confirm Password : 12345
    Input text    //*[@name="confirmPassword"]    12345
    ${confirmPassword}=    Get Value    //*[@name="confirmPassword"]
    Should Be Equal    ${confirmPassword}    12345

    #password match
    Should Be Equal    ${confirmPassword}    ${password}



    #Signup Button
    Click Element    //*[@class="MuiTypography-root MuiTypography-h6 mui-style-haplq4"]

    #verrify error message
    Wait Until Page Contains  Please enter a valid email address  timeout=3s
    
TC1-3 368
    [Tags]    all input
    Open Browser    https://dev.d2g12c5od8o9j.amplifyapp.com/signup    chrome
    Maximize Browser Window

    Wait Until Element Is Visible    //*[@class="MuiBox-root mui-style-5ul8ui"] 
    
    #Input Email : singsong@email.com
    Input text    //*[@name="email"]    singsong@email.com
    ${email}=    Get Value    //*[@name="email"]
    Should Be Equal    ${email}    singsong@email.com

    #Input Password : 12345
    Input text    //*[@name="password"]    12345
    ${password}=    Get Value    //*[@name="password"]
    Should Be Equal    ${password}    12345

    #Input Confirm Password : 12345
    Input text    //*[@name="confirmPassword"]    12345
    ${confirmPassword}=    Get Value    //*[@name="confirmPassword"]
    Should Be Equal    ${confirmPassword}    12345

    #password match
    Should Be Equal    ${confirmPassword}    ${password}



    #Signup Button
    Click Element    //*[@class="MuiTypography-root MuiTypography-h6 mui-style-haplq4"]

    #verrify error message
    Wait Until Page Contains  This email address has already been registered  timeout=5s

TC1-4 457
    [Tags]    all input
    Open Browser    https://dev.d2g12c5od8o9j.amplifyapp.com/signup    chrome
    Maximize Browser Window

    Wait Until Element Is Visible    //*[@class="MuiBox-root mui-style-5ul8ui"] 
    
    #Input Email : sernlnwza007@gmail.com 
    Input text    //*[@name="email"]    sernlnwza007@gmail.com 
    ${email}=    Get Value    //*[@name="email"]
    Should Be Equal    ${email}    sernlnwza007@gmail.com 

    #Input Password : 1234
    Input text    //*[@name="password"]    1234
    ${password}=    Get Value    //*[@name="password"]
    Should Be Equal    ${password}    1234

    #Input Confirm Password : 1234
    Input text    //*[@name="confirmPassword"]    1235
    ${confirmPassword}=    Get Value    //*[@name="confirmPassword"]
    Should Be Equal    ${confirmPassword}    1235

    #password not match
    Should Not Be Equal    ${confirmPassword}    ${password}



    #Signup Button
    Click Element    //*[@class="MuiTypography-root MuiTypography-h6 mui-style-haplq4"]

    #verrify error message
    Wait Until Page Contains  Password must be at least 5 characters  timeout=5s  
    Wait Until Page Contains  Password is not match  timeout=5s  

    #Verify Success Message
    #Wait Until Element Contains    //*[@class="MuiTypography-root MuiTypography-h2 mui-style-16mb4mf"]    LOGIN    timeout=10s
    
    
TC1-5 458
    [Tags]    all input
    Open Browser    https://dev.d2g12c5od8o9j.amplifyapp.com/signup    chrome
    Maximize Browser Window

    Wait Until Element Is Visible    //*[@class="MuiBox-root mui-style-5ul8ui"] 
    
    #Input Email : sernlnwza007@gmail.com 
    Input text    //*[@name="email"]    sernlnwza007@gmail.com 
    ${email}=    Get Value    //*[@name="email"]
    Should Be Equal    ${email}    sernlnwza007@gmail.com 

    #Input Password : 1234
    Input text    //*[@name="password"]    1234
    ${password}=    Get Value    //*[@name="password"]
    Should Be Equal    ${password}    1234

    #Input Confirm Password : 1234
    Input text    //*[@name="confirmPassword"]    1234
    ${confirmPassword}=    Get Value    //*[@name="confirmPassword"]
    Should Be Equal    ${confirmPassword}    1234

    #password match
    Should Be Equal    ${confirmPassword}    ${password}
    


    #Signup Button
    Click Element    //*[@class="MuiTypography-root MuiTypography-h6 mui-style-haplq4"]

    #verrify error message

     Wait Until Page Contains  Password must be at least 5 characters  timeout=5s
    

TC1-6 467
    [Tags]    all input
    Open Browser    https://dev.d2g12c5od8o9j.amplifyapp.com/signup    chrome
    Maximize Browser Window

    Wait Until Element Is Visible    //*[@class="MuiBox-root mui-style-5ul8ui"] 
    
    #Input Email : sernlnwza007@gmail.com
    Input text    //*[@name="email"]    sernlnwza007@gmail.com
    ${email}=    Get Value    //*[@name="email"]
    Should Be Equal    ${email}    sernlnwza007@gmail.com

    #Input Password : 12345
    Input text    //*[@name="password"]    12345
    ${password}=    Get Value    //*[@name="password"]
    Should Be Equal    ${password}    12345

    #Input Confirm Password : 12346
    Input text    //*[@name="confirmPassword"]    12346
    ${confirmPassword}=    Get Value    //*[@name="confirmPassword"]
    Should Be Equal    ${confirmPassword}    12346

    #password not match
    Should Not Be Equal    ${confirmPassword}    ${password}


    #Signup Button
    Click Element    //*[@class="MuiTypography-root MuiTypography-h6 mui-style-haplq4"]

    #verrify error message

    Wait Until Page Contains  Password is not match  timeout=5s  

TC1-7 468
    [Tags]    all input
    Open Browser    https://dev.d2g12c5od8o9j.amplifyapp.com/signup    chrome
    Maximize Browser Window

    Wait Until Element Is Visible    //*[@class="MuiBox-root mui-style-5ul8ui"] 
    
    #Input Email : sernlnwza007@gmail.com 
    Input text    //*[@name="email"]    sernlnwza007@gmail.com 
    ${email}=    Get Value    //*[@name="email"]
    Should Be Equal    ${email}    sernlnwza007@gmail.com 

    #Input Password : 12345
    Input text    //*[@name="password"]    12345
    ${password}=    Get Value    //*[@name="password"]
    Should Be Equal    ${password}    12345

    #Input Confirm Password : 12345
    Input text    //*[@name="confirmPassword"]    12345
    ${confirmPassword}=    Get Value    //*[@name="confirmPassword"]
    Should Be Equal    ${confirmPassword}    12345

    #password  match
    Should Be Equal    ${confirmPassword}    ${password}


    #Signup Button
    Click Element    //*[@class="MuiTypography-root MuiTypography-h6 mui-style-haplq4"]

    #verrify success message

    Wait Until Element Contains    //*[@class="MuiTypography-root MuiTypography-h2 mui-style-16mb4mf"]    LOGIN    timeout=10s




