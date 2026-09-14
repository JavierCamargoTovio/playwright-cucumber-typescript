Feature: Login en SauceDemo
  Como usuario de SauceDemo
  Quiero iniciar sesion con mis credenciales
  Para acceder al catalogo de productos

  Background:
    Given el usuario esta en la pagina de login de SauceDemo

  # ---------- Ruta feliz ----------

  Scenario: Login exitoso con credenciales validas
    When el usuario ingresa el usuario "standard_user" y la contrasena "secret_sauce"
    And hace clic en el boton de login
    Then el usuario deberia ver la pagina de productos

  Scenario: Login exitoso con usuario con problemas de UI
    When el usuario ingresa el usuario "problem_user" y la contrasena "secret_sauce"
    And hace clic en el boton de login
    Then el usuario deberia ver la pagina de productos

  # ---------- Casos negativos ----------

  Scenario: Login fallido con usuario bloqueado
    When el usuario ingresa el usuario "locked_out_user" y la contrasena "secret_sauce"
    And hace clic en el boton de login
    Then deberia ver el mensaje de error "Epic sadface: Sorry, this user has been locked out."

  Scenario Outline: Login fallido con credenciales invalidas o incompletas
    When el usuario ingresa el usuario "<usuario>" y la contrasena "<contrasena>"
    And hace clic en el boton de login
    Then deberia ver el mensaje de error "<mensaje>"

    Examples:
      | usuario       | contrasena       | mensaje                                                                     |
      | standard_user | contrasena_mala  | Epic sadface: Username and password do not match any user in this service  |
      | usuario_falso | secret_sauce     | Epic sadface: Username and password do not match any user in this service  |
      | STANDARD_USER | secret_sauce     | Epic sadface: Username and password do not match any user in this service  |
      |               | secret_sauce     | Epic sadface: Username is required                                         |
      | standard_user |                  | Epic sadface: Password is required                                        |
      |               |                  | Epic sadface: Username is required                                        |
