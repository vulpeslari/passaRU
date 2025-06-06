import streamlit as st
from streamlit_javascript import st_javascript
from web3 import Web3
import json
import streamlit.components.v1 as components

# Configura provider Sepolia
provider_url = "https://sepolia.infura.io/v3/95b9df5d95cc4190bf94c2d7f9ddef2f"
w3 = Web3(Web3.HTTPProvider(provider_url))

# Endereço do contrato
contract_address = "0xB098aE7ddc405A6a6F891693e00c8B9895e1a93f"

# Carrega ABI
with open("abi.txt", "r", encoding="utf-8") as abi_file:
    abi = json.load(abi_file)

contract = w3.eth.contract(address=contract_address, abi=abi)

st.set_page_config(page_title="PASSARU", layout="centered")
st.title("PASSARU")

st.markdown("Clique abaixo para conectar sua carteira MetaMask:")

components.html(
    """
    <script>
    async function connectWallet() {
        if (typeof window.ethereum !== 'undefined') {
            try {
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                const account = accounts[0];
                document.getElementById('account').innerText = account;
            } catch (error) {
                document.getElementById('account').innerText = "Erro: " + error.message;
            }
        } else {
            document.getElementById('account').innerText = "MetaMask não encontrada";
        }
    }
    </script>
    <button onclick="connectWallet()">Conectar MetaMask</button>
    <p><strong>Conta:</strong> <span id="account">Não conectada</span></p>
    """,
    height=150,
)


# # ✅ Adicionar Produto
# st.subheader("Adicionar Produto")
# name = st.text_input("Nome do produto")
# price_eth = st.number_input("Preço (em ETH)", min_value=0.001)
# price_wei = w3.to_wei(price_eth, 'ether')

# if st.button("📤 Adicionar"):
#     try:
#         nonce = w3.eth.get_transaction_count(sender_address)
#         tx = contract.functions.addProduct(name, price_wei).build_transaction({
#             'chainId': 11155111,
#             'gas': 300000,
#             'gasPrice': w3.to_wei('10', 'gwei'),
#             'nonce': nonce
#         })
#         signed = w3.eth.account.sign_transaction(tx, private_key)
#         tx_hash = w3.eth.send_raw_transaction(signed.raw_transaction)
#         st.success(f"Produto enviado! TX: {tx_hash.hex()}")
#     except Exception as e:
#         st.error(str(e))

# # 📋 Listar Produtos
# st.subheader("📋 Produtos à Venda")
# try:
#     products = contract.functions.listProduct().call()
#     for p in products:
#         st.markdown(f"""
#         #### 🛍️ Produto ID: {p[0]}
#         - Nome: **{p[1]}**
#         - Preço: {w3.from_wei(p[2], 'ether')} ETH
#         - Vendedor: `{p[3]}`
#         - Vendido: {"✅ Sim" if p[5] else "❌ Não"}
#         """)

#         if not p[5] and st.button(f"💰 Comprar Produto #{p[0]}"):
#             try:
#                 nonce = w3.eth.get_transaction_count(sender_address)
#                 tx = contract.functions.purchaseProduct(p[0]).build_transaction({
#                     'chainId': 11155111,
#                     'gas': 200000,
#                     'gasPrice': w3.to_wei('10', 'gwei'),
#                     'nonce': nonce,
#                     'value': p[2]
#                 })
#                 signed = w3.eth.account.sign_transaction(tx, private_key)
#                 tx_hash = w3.eth.send_raw_transaction(signed.raw_transaction)
#                 st.success(f"Compra realizada! TX: {tx_hash.hex()}")
#             except Exception as e:
#                 st.error(str(e))
# except Exception as e:
#     st.error("Erro ao carregar produtos: " + str(e))

