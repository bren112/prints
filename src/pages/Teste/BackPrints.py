from flask import Flask, jsonify
from flask_cors import CORS
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
import time

app = Flask(__name__)
CORS(app)

import requests
import pandas as pd

from flask import jsonify
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
import time

# SEG
def criar_driver_segtrab():
    chrome_options = Options()
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("--incognito")  # modo anônimo

    # Desativa sugestões de senha e alertas do Chrome
    chrome_options.add_experimental_option("prefs", {
        "credentials_enable_service": False,
        "profile.password_manager_enabled": False
    })

    service = Service(ChromeDriverManager().install())
    return webdriver.Chrome(service=service, options=chrome_options)

# Função principal para coletar os dados
def coletar_segtrab():
    driver = criar_driver_segtrab()
    try:
        driver.get("http://10.10.1.114/sws/index.html")
        time.sleep(3)

        driver.find_element(By.ID, "ext-gen249").click()
        time.sleep(3)

        driver.find_element(By.XPATH, "//span[text()='Contadores de uso']").click()
        time.sleep(3)

        valor_ultima_celula = driver.find_element(
            By.XPATH,
            "(//table[contains(@class, 'x-grid3-row-table')]//tr)[3]//td[last()]//div"
        ).text

        print(f"Valor extraído (Setor SEGTRAB): {valor_ultima_celula}")
        valor_int = int(valor_ultima_celula.replace(",", "").strip())

        valor_mensal = valor_int - 291227  # base inicial, ajuste se necessário

        return {
            "valor_coletado": valor_ultima_celula,
            "valor_mensal": valor_mensal
        }

    except Exception as e:
        print(f"Erro ao obter valor do setor SEGTRAB: {e}")
        return {"erro": str(e)}

    finally:
        time.sleep(2)
        driver.quit()

# Rota Flask
@app.route('/segtrab', methods=['GET'])
def rota_segtrab():
    return jsonify(coletar_segtrab())

# ================= REFEITÓRIO =================
@app.route('/refeitorio', methods=['GET'])
def rota_refeitorio():
    try:
        resultado = obter_valor_refeitorio()
        return jsonify(resultado)
    except Exception as e:
        return jsonify({"erro": str(e)})

def obter_valor_refeitorio():
    chrome_options = Options()
    chrome_options.add_argument("--incognito")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_experimental_option("prefs", {
        "credentials_enable_service": False,
        "profile.password_manager_enabled": False
    })

    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=chrome_options)

    try:
        driver.get("http://10.10.1.112/")
        time.sleep(3)

        driver.find_element(By.ID, "ext-gen249").click()
        time.sleep(3)

        driver.find_element(By.XPATH, "//span[text()='Contadores de uso']").click()
        time.sleep(3)

        valor_ultima_celula = driver.find_element(
            By.XPATH,
            "(//table[contains(@class, 'x-grid3-row-table')]//tr)[3]//td[last()]//div"
        ).text

        print(f"Valor extraído (Setor Refeitório): {valor_ultima_celula}")
        valor_int = int(valor_ultima_celula.replace(",", "").strip())
        valor_mensal = valor_int - 41729  # 🛠 Ajuste conforme base do setor

        return {
            "valor_coletado": valor_ultima_celula,
            "valor_mensal": valor_mensal,
            "ultimo_usuario": "Não disponível"
        }

    except Exception as e:
        print(f"Erro ao obter valor do setor Refeitório: {e}")
        return {"erro": str(e)}

    finally:
        time.sleep(2)
        driver.quit()

# ================= RH =================
@app.route('/rh', methods=['GET'])
def rota_rh():
    print("Rodando coleta RH...")  
    try:
        resultado = coletar_rh()
        return jsonify(resultado)
    except Exception as e:
        return jsonify({"erro": str(e)})

def coletar_rh():
    driver = criar_driver()
    try:
        driver.get("http://10.10.1.113")

        driver.find_element(By.ID, "i0019").send_keys("1234")
        driver.find_element(By.ID, "i2101").send_keys("1234")
        time.sleep(1)

        driver.find_element(By.ID, "submitButton").click()
        time.sleep(2)

        driver.find_element(By.CLASS_NAME, "Standby").click()
        driver.find_element(By.LINK_TEXT, "Verificar Contador").click()

        valor_td = driver.find_element(By.XPATH, '//tr[th[contains(text(), "101: Total 1")]]/td').text

        driver.find_element(By.LINK_TEXT, "Log do Trabalho").click()
        time.sleep(1)

        tabela = driver.find_element(By.XPATH, '//div[@class="ItemListComponent"]/table')
        linhas = tabela.find_elements(By.XPATH, './/tbody/tr')

        if linhas:
            celulas = linhas[0].find_elements(By.TAG_NAME, 'td')
            nome_usuario = celulas[6].text if len(celulas) > 6 else "N/A"
        else:
            nome_usuario = "Sem dados"

        total_int = int(valor_td.replace(".", "").strip())
        valor_mensal = total_int - 48574  # Base inicial RH (ajuste conforme necessário)

        return {
            "total_valor": valor_td,
            "ultimo_usuario": nome_usuario,
            "valor_mensal": valor_mensal
        }

    except Exception as e:
        return {"erro": str(e)}

    finally:
        driver.quit()


def pegar_dado_setor(url):
    nome_setor = url.split("/")[-1].lower()
    try:
        response = requests.get(url, timeout=5)
        if response.status_code == 200:
            dados = response.json()
            valor = dados.get("valor_coletado") or dados.get("total_valor")
            return {
                "Setor": nome_setor,
                "IP": IPS_SETORES.get(nome_setor, "Desconhecido"),
                "Valor Total": valor
            }
    except Exception as e:
        print(f"Erro no setor {nome_setor}: {e}")
    return None




def criar_driver():
    """Configura e retorna um Chrome WebDriver"""
    chrome_options = Options()
    chrome_options.add_argument("--disable-gpu")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("--start-minimized")

    service = Service(ChromeDriverManager().install())
    return webdriver.Chrome(service=service, options=chrome_options)


# ================= ADMINISTRATIVO =================
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
from selenium.common.exceptions import NoAlertPresentException, NoSuchElementException
import time

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
import time

def criar_driver():
    chrome_options = Options()

    # Executa em modo anônimo (incognito)
    chrome_options.add_argument("--incognito")

    # Outras opções úteis
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")

    # Desativa sugestões de senha e alertas do Chrome
    chrome_options.add_experimental_option("prefs", {
        "credentials_enable_service": False,
        "profile.password_manager_enabled": False
    })

    service = Service(ChromeDriverManager().install())
    return webdriver.Chrome(service=service, options=chrome_options)

def coletar_administrativo():
    driver = criar_driver()
    try:
        driver.get("http://10.10.1.90")

        driver.find_element(By.ID, "i0019").send_keys("1234")
        driver.find_element(By.ID, "i2101").send_keys("1234")
        time.sleep(1)

        driver.find_element(By.ID, "submitButton").click()
        time.sleep(2)

        # Navegação após login
        driver.find_element(By.CLASS_NAME, "Standby").click()
        driver.find_element(By.LINK_TEXT, "Verificar Contador").click()

        valor_td = driver.find_element(By.XPATH, '//tr[th[contains(text(), "101: Total 1")]]/td').text

        driver.find_element(By.LINK_TEXT, "Log do Trabalho").click()
        time.sleep(1)

        tabela = driver.find_element(By.XPATH, '//div[@class="ItemListComponent"]/table')
        linhas = tabela.find_elements(By.XPATH, './/tbody/tr')

        if linhas:
            celulas = linhas[0].find_elements(By.TAG_NAME, 'td')
            nome_usuario = celulas[6].text if len(celulas) > 6 else "N/A"
        else:
            nome_usuario = "Sem dados"

        total_int = int(valor_td.replace(".", "").strip())
        valor_mensal = total_int - 43980

        return {
            "total_valor": valor_td,
            "ultimo_usuario": nome_usuario,
            "valor_mensal": valor_mensal
        }

    except Exception as e:
        return {"erro": str(e)}

    finally:
        driver.quit()


@app.route('/administrativo', methods=['GET'])
def rota_administrativo():
    try:
        resultado = coletar_administrativo()
        return jsonify(resultado)
    except Exception as e:
        return jsonify({"erro": str(e)})


# ================= ALMOXIDAGRO =================
def coletar_almoxid_agro():
    driver = criar_driver()
    try:
        driver.get("http://10.10.1.102/") #almoxidagro
        time.sleep(2)

        driver.find_element(By.ID, "ext-gen249").click()
        time.sleep(2)

        driver.find_element(By.XPATH, "//span[text()='Contadores de uso']").click()
        time.sleep(2)

        valor = driver.find_element(
            By.XPATH,
            "(//table[contains(@class, 'x-grid3-row-table')]//tr)[3]//td[last()]//div[@class='x-grid3-cell-inner x-grid3-col-5']"
        ).text

        total_int = int(valor.replace(".", "").strip())
        valor_mensal = total_int - 213306

        return {
            "valor_coletado": valor,
            "valor_mensal": valor_mensal
        }

    finally:
        driver.quit()


@app.route('/almoxidAgro', methods=['GET'])
def rota_almoxid_agro():
    try:
        resultado = coletar_almoxid_agro()
        return jsonify(resultado)
    except Exception as e:
        return jsonify({"erro": str(e)})

# ================= AGRÍCOLA =================
def coletar_agricola():
    driver = criar_driver()
    try:
        driver.set_window_position(-2000, 0)
        driver.get("http://10.10.1.101/") #agricola
        time.sleep(3)

        driver.find_element(By.ID, "ext-gen249").click()
        time.sleep(3)

        driver.find_element(By.XPATH, "//span[text()='Contadores de uso']").click()
        time.sleep(3)

        valor = driver.find_element(
            By.XPATH, "(//table[contains(@class, 'x-grid3-row-table')]//tr)[3]//td[last()]//div"
        ).text

        valor_int = int(valor.replace(",", "").strip())
        valor_mensal = valor_int - 141829  # Ajuste este número base se necessário

        return {
            "valor_coletado": valor,
            "valor_mensal": valor_mensal
        }

    finally:
        time.sleep(2)
        driver.quit()


@app.route('/agricola', methods=['GET'])
def rota_agricola():
    try:
        resultado = coletar_agricola()
        return jsonify(resultado)
    except Exception as e:
        return jsonify({"erro": str(e)})

# ================= JURÍDICO =================
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
import time

def obter_valor_juridico():
    chrome_options = Options()
    chrome_options.add_argument("--start-minimized")
    chrome_options.add_argument("--disable-gpu")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")

    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=chrome_options)

    try:
        driver.set_window_position(-2000, 0)
        driver.get("http://10.10.1.109") #juridico

        # Login
        driver.find_element(By.ID, "i0019").send_keys("1234")
        driver.find_element(By.ID, "i2101").send_keys("1234")
        driver.find_element(By.ID, "submitButton").click()

        wait = WebDriverWait(driver, 10)

        # Navegação com espera
        wait.until(EC.element_to_be_clickable((By.CLASS_NAME, "Standby"))).click()
        wait.until(EC.element_to_be_clickable((By.LINK_TEXT, "Verificar Contador"))).click()

        # Extração do valor de contador
        valor_td = wait.until(
            EC.presence_of_element_located((
                By.XPATH, '//tr[th[contains(text(), "101: Total 1")]]/td'
            ))
        ).text
        valor_int = int(valor_td.replace(",", "").replace(".", "").strip())

        # Último usuário
        wait.until(EC.element_to_be_clickable((By.LINK_TEXT, "Log do Trabalho"))).click()
        tabela = wait.until(
            EC.presence_of_element_located((By.XPATH, '//div[@class="ItemListComponent"]/table'))
        )
        linhas = tabela.find_elements(By.XPATH, './/tbody/tr')

        if linhas:
            celulas = linhas[0].find_elements(By.TAG_NAME, 'td')
            nome_usuario = celulas[6].text if len(celulas) > 6 else "N/A"
        else:
            nome_usuario = "Sem dados"

        valor_mensal = valor_int - 26931  # ajuste conforme sua base

        return {
            "valor_coletado": valor_td,
            "valor_mensal": valor_mensal,
            "ultimo_usuario": nome_usuario
        }

    except Exception as e:
        return {"erro": str(e)}

    finally:
        driver.quit()



@app.route('/juridico', methods=['GET'])
def rota_juridico():
    try:
        resultado = obter_valor_juridico()
        return jsonify(resultado)
    except Exception as e:
        return jsonify({"erro": str(e)})

# ================= ENFERMAGEM =================
from selenium import webdriver
from selenium.webdriver.common.by import By
import time
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options

# Função para criar um driver invisível (headless)
def criar_driver_invisivel():
    chrome_options = Options()
    chrome_options.add_argument("--headless=new")  # Modo invisível
    chrome_options.add_argument("--disable-gpu")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_experimental_option("prefs", {
        "credentials_enable_service": False,
        "profile.password_manager_enabled": False
    })

    service = Service(ChromeDriverManager().install())
    return webdriver.Chrome(service=service, options=chrome_options)

# Função para coletar dados da impressora do setor Enfermagem
def obter_valor_enfermagem():
    driver = criar_driver_invisivel()

    try:
        driver.get("http://10.10.1.105/") #enfermagem
        time.sleep(3)

        driver.find_element(By.ID, "ext-gen249").click()
        time.sleep(3)

        driver.find_element(By.XPATH, "//span[text()='Contadores de uso']").click()
        time.sleep(3)

        valor_ultima_celula = driver.find_element(
            By.XPATH, "(//table[contains(@class, 'x-grid3-row-table')]//tr)[3]//td[last()]//div"
        ).text

        valor_int = int(valor_ultima_celula.replace(",", "").strip())
        valor_mensal = valor_int - 82095  # Base inicial da enfermagem

        return {
            "valor_coletado": valor_ultima_celula,
            "valor_mensal": valor_mensal,
            "ultimo_usuario": "Não disponível"
        }

    except Exception as e:
        print(f"Erro ao obter valor do setor Enfermagem: {e}")
        return {"erro": str(e)}

    finally:
        time.sleep(2)
        driver.quit()


@app.route("/enfermagem", methods=["GET"])
def rota_enfermagem():
    resultado = obter_valor_enfermagem()
    return jsonify(resultado)




# ==============ALMOXIND =================
from selenium import webdriver
from selenium.webdriver.common.by import By
import time
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options

def obter_valor_almoxind():
    chrome_options = Options()
    chrome_options.add_argument("--start-minimized")
    chrome_options.add_argument("--disable-gpu") 
    chrome_options.add_argument("--no-sandbox")  
    chrome_options.add_argument("--disable-dev-shm-usage")  

    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=chrome_options)

    try:
        driver.set_window_position(-2000, 0)

        driver.get("http://10.10.1.103/") #almoxind
        time.sleep(3)

        driver.find_element(By.ID, "ext-gen249").click()
        time.sleep(3)

        driver.find_element(By.XPATH, "//span[text()='Contadores de uso']").click()
        time.sleep(3)

        valor_str = driver.find_element(
            By.XPATH, "(//table[contains(@class, 'x-grid3-row-table')]//tr)[3]//td[last()]//div"
        ).text

        valor_int = int(valor_str.replace(",", "").strip())
        valor_mensal = valor_int - 154403

        return {
            "valor_coletado": valor_str,
            "valor_mensal": valor_mensal
        }

    except Exception as e:
        return {"erro": str(e)}

    finally:
        time.sleep(2)
        driver.quit()

@app.route('/almoxind', methods=['GET'])
def almoxind():
    resultado = obter_valor_almoxind()
    return jsonify(resultado)


# =========PCMI===============

from selenium import webdriver
from selenium.webdriver.common.by import By
import time
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options

def obter_valor_pcmi():
    chrome_options = Options()
    chrome_options.add_argument("--start-minimized")
    chrome_options.add_argument("--disable-gpu")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")

    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=chrome_options)

    try:
        driver.set_window_position(-2000, 0)

        url = "http://10.10.1.111/" #pcmi
        driver.get(url)
        time.sleep(3)

        botao_informacao = driver.find_element(By.ID, "ext-gen249")
        botao_informacao.click()
        time.sleep(3)

        contadores_item = driver.find_element(By.XPATH, "//span[text()='Contadores de uso']")
        contadores_item.click()
        time.sleep(3)

        valor_ultima_celula = driver.find_element(
            By.XPATH, "(//table[contains(@class, 'x-grid3-row-table')]//tr)[3]//td[last()]//div"
        ).text

        print(f"Valor extraído (Setor PCMI): {valor_ultima_celula}")
        valor_int = int(valor_ultima_celula.replace(",", "").strip())
        valor_mensal = valor_int - 42668

        return {
            "valor_coletado": valor_int,
            "valor_mensal": valor_mensal
        }

    except Exception as e:
        print(f"Erro ao obter valor do setor PCMI: {e}")
        return {
            "valor_coletado": None,
            "valor_mensal": None
        }

    finally:
        time.sleep(2)
        driver.quit()

@app.route('/pcmi', methods=['GET'])
def pcmi():
    resultado = obter_valor_pcmi()
    return jsonify(resultado)

# ============LABORATÓRIO=======================
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
import time

def obter_valor_labo():
    chrome_options = Options()
    chrome_options.add_argument("--start-minimized")
    chrome_options.add_argument("--disable-gpu")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")

    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=chrome_options)

    try:
        driver.set_window_position(-2000, 0)
        driver.get("http://10.10.1.110/") #laboratorio
        time.sleep(3)

        driver.find_element(By.ID, "ext-gen249").click()
        time.sleep(3)

        driver.find_element(By.XPATH, "//span[text()='Contadores de uso']").click()
        time.sleep(3)

        valor_ultima_celula = driver.find_element(
            By.XPATH, "(//table[contains(@class, 'x-grid3-row-table')]//tr)[3]//td[last()]//div"
        ).text

        print(f"Valor extraído (Setor LABORATORIO): {valor_ultima_celula}")
        valor_int = int(valor_ultima_celula.replace(",", "").strip())

        valor_mensal = valor_int - 31481  # ajuste conforme a base inicial do setor

        return {
            "valor_coletado": valor_ultima_celula,
            "valor_mensal": valor_mensal
        }

    except Exception as e:
        return {"erro": str(e)}

    finally:
        time.sleep(2)
        driver.quit()


@app.route('/laboratorio', methods=['GET'])
def laboratorio():
    resultado = obter_valor_labo()
    return jsonify(resultado)

#============== FROTA ===============
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
import time


def obter_valor_frota():
    chrome_options = Options()
    chrome_options.add_argument("--start-minimized")
    chrome_options.add_argument("--disable-gpu")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")

    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=chrome_options)

    try:
        driver.set_window_position(-2000, 0)
        driver.get("http://10.10.1.108/") #frota
        time.sleep(3)

        driver.find_element(By.ID, "ext-gen249").click()
        time.sleep(3)

        driver.find_element(By.XPATH, "//span[text()='Contadores de uso']").click()
        time.sleep(3)

        valor_ultima_celula = driver.find_element(
            By.XPATH, "(//table[contains(@class, 'x-grid3-row-table')]//tr)[3]//td[last()]//div"
        ).text

        print(f"Valor extraído (Setor FROTA): {valor_ultima_celula}")
        valor_int = int(valor_ultima_celula.replace(",", "").strip())

        valor_mensal = valor_int - 268357  # ajuste conforme a base inicial do setor

        return {
            "valor_coletado": valor_ultima_celula,
            "valor_mensal": valor_mensal
        }

    except Exception as e:
        return {"erro": str(e)}

    finally:
        time.sleep(2)
        driver.quit()



@app.route('/frota', methods=['GET'])
def frota():
    resultado = obter_valor_frota()
    return jsonify(resultado)


from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
import time

#========= faturamento ================

def obter_valor_faturamento():
    chrome_options = Options()
    chrome_options.add_argument("--start-minimized")
    chrome_options.add_argument("--disable-gpu")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")

    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=chrome_options)

    try:
        driver.set_window_position(-2000, 0)
        driver.get("http://10.10.1.106/") #faturamento
        time.sleep(3)

        driver.find_element(By.ID, "ext-gen249").click()
        time.sleep(3)

        driver.find_element(By.XPATH, "//span[text()='Contadores de uso']").click()
        time.sleep(3)

        valor_ultima_celula = driver.find_element(
            By.XPATH, "(//table[contains(@class, 'x-grid3-row-table')]//tr)[3]//td[last()]//div"
        ).text

        print(f"Valor extraído (Setor FATURAMENTO): {valor_ultima_celula}")
        valor_int = int(valor_ultima_celula.replace(",", "").strip())

        valor_mensal = valor_int - 156615  # ajuste conforme a base inicial do setor

        return {
            "valor_coletado": valor_ultima_celula,
            "valor_mensal": valor_mensal
        }

    except Exception as e:
        return {"erro": str(e)}

    finally:
        time.sleep(2)
        driver.quit()


# Endpoint Flask
@app.route('/faturamento', methods=['GET'])
def faturamento():
    resultado = obter_valor_faturamento()
    return jsonify(resultado)


# ================= RUN APP =================
if __name__ == '__main__':
  app.run(host='0.0.0.0', port=5000, debug=True)

