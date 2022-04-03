import os
import subprocess
import re


def find_rpi_ip():
    find_gateway_cmd = subprocess.check_output("arp -a", shell=True).decode("utf-8")
    gateway_match = re.search("(?<=gateway \().*?(?=\))", find_gateway_cmd)

    if gateway_match:
        gateway_ip = gateway_match.group(0)
        print("\nGateway is probably", gateway_ip, "\n")
        parts = gateway_ip.split(".")
        to_search = "{}.{}.{}.1-255".format(parts[0], parts[1], parts[2])
        print("Running nmap on range", to_search, "\n")
        os.system("nmap -sP {}".format(to_search))
        print("\nRPi is probably one of the above")
        print("Try SSH:ing into them and put the correct one in your ~/.ssh/config")

    else:
        print("could not find gateway")


if __name__ == "__main__":
    find_rpi_ip()
