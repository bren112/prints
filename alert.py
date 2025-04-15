import random
import time

def narrar(texto):
    for c in texto:
        print(c, end='', flush=True)
        time.sleep(0.02)
    print()

def escolher_time():
    narrar("Escolha seu time para o Derby 2024:")
    narrar("1. Corinthians 🖤")
    narrar("2. Palmeiras 💚")
    time_escolhido = input("Digite 1 ou 2: ")

    if time_escolhido == '1':
        return "Corinthians", "Palmeiras"
    elif time_escolhido == '2':
        return "Palmeiras", "Corinthians"
    else:
        narrar("Escolha inválida. Você jogará com o Corinthians.")
        return "Corinthians", "Palmeiras"

def jogar_turno(turno, seu_time, rival):
    narrar(f"\n⏱️ Minuto {turno * 15} - {turno * 15 + 15}")
    narrar("Escolha sua jogada:")
    narrar("1. Ataque Total ⚔️")
    narrar("2. Defesa Recuada 🛡️")
    narrar("3. Contra-Ataque 🚀")
    escolha = input("-> ")

    jogadas = ["Ataque Total", "Defesa Recuada", "Contra-Ataque"]
    acao_rival = random.choice(jogadas)

    narrar(f"{rival} prepara jogada: {acao_rival}...")

    chance_gol = random.randint(1, 10)
    seu_gol = False
    rival_gol = False

    if escolha == "1":
        if acao_rival == "Defesa Recuada" and chance_gol > 6:
            seu_gol = True
        elif acao_rival == "Contra-Ataque" and chance_gol < 4:
            rival_gol = True
    elif escolha == "2":
        if acao_rival == "Ataque Total" and chance_gol > 7:
            rival_gol = True
    elif escolha == "3":
        if acao_rival == "Ataque Total" and chance_gol > 6:
            seu_gol = True
        elif acao_rival == "Defesa Recuada" and chance_gol > 8:
            seu_gol = True

    return seu_gol, rival_gol

def derby_2024():
    narrar("🏟️ Bem-vindo ao Derby 2024!")
    seu_time, rival = escolher_time()
    narrar(f"\n{seu_time} 🆚 {rival}")
    narrar("Vamos começar a partida!")

    placar_seu_time = 0
    placar_rival = 0

    for turno in range(6):  # 6 turnos = 90 minutos
        seu_gol, rival_gol = jogar_turno(turno + 1, seu_time, rival)

        if seu_gol:
            narrar(f"⚽ GOOOOOL do {seu_time}!!!")
            placar_seu_time += 1
        if rival_gol:
            narrar(f"⚽ Gol do {rival}...")
            placar_rival += 1

        narrar(f"Placar parcial: {seu_time} {placar_seu_time} x {placar_rival} {rival}")
        time.sleep(1)

    narrar("\n🔔 Fim de jogo!")
    narrar(f"Placar final: {seu_time} {placar_seu_time} x {placar_rival} {rival}")

    if placar_seu_time > placar_rival:
        narrar(f"🎉 {seu_time} vence o Derby 2024! A torcida vai à loucura!")
    elif placar_seu_time < placar_rival:
        narrar(f"💔 Derrota no clássico... {rival} leva a melhor.")
    else:
        narrar("⚖️ Empate! Que jogão, digno de um clássico!")

if __name__ == "__main__":
    derby_2024()
