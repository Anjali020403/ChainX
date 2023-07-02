import os
import csv
import socket
import struct
import threading
from flask import Flask, jsonify
from flask_cors import CORS
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

app = Flask(__name__)
CORS(app)

data_folder = os.path.join(os.path.dirname(__file__), 'data')
dataset_file = os.path.join(data_folder, 'dataset.csv')

SERVER_HOST = '127.0.0.1'
SERVER_PORT = 9011

data_lock = threading.Lock()
latest_data = []

packet_format = '<I30sQLQLQLQLQLQQ'

field_descriptions = [
    ('Packet Length', 'Int32', 0, 4),
    ('Trading Symbol', 'String', 4, 30),
    ('Sequence Number', 'Long/int64', 34, 8),
    ('Timestamp', 'Long/Int64', 42, 8),
    ('Last Traded Price (LTP)', 'Long/Int64', 50, 8),
    ('Last Traded Quantity', 'Long/Int64', 58, 8),
    ('Volume', 'Long/Int64', 66, 8),
    ('Bid Price', 'Long/Int64', 74, 8),
    ('Bid Quantity', 'Long/Int64', 82, 8),
    ('Ask Price', 'Long/Int64', 90, 8),
    ('Ask Quantity', 'Long/Int64', 98, 8),
    ('Open Interest (OI)', 'Long/Int64', 106, 8),
    ('Previous Close Price', 'Long/Int64', 114, 8),
    ('Previous Open Interest', 'Long/Int64', 122, 8)
]

@app.route('/')
def get_latest_data():
    with data_lock:
        return jsonify(latest_data)

def process_packet(packet):
    with data_lock:
        fields = struct.unpack(packet_format, packet)
        packet_data = {
            'Packet Length': fields[0],
            'Trading Symbol': fields[1].decode().strip('\x00'),
            'Sequence Number': fields[2],
            'Timestamp': fields[3],
            'Last Traded Price (LTP)': fields[4],
            'Last Traded Quantity': fields[5],
            'Volume': fields[6],
            'Bid Price': fields[7],
            'Bid Quantity': fields[8],
            'Ask Price': fields[9],
            'Ask Quantity': fields[10],
            'Open Interest (OI)': fields[11],
            'Previous Close Price': fields[12],
            'Previous Open Interest': fields[13]
        }
        latest_data.append(packet_data)

def process_data_file():
    with open(dataset_file, 'r') as file:
        reader = csv.reader(file)
        for row in reader:
            packet = struct.pack(packet_format, *row)
            process_packet(packet)

def start_watchdog():
    class FileModifiedHandler(FileSystemEventHandler):
        def on_modified(self, event):
            if not event.is_directory and event.src_path == dataset_file:
                process_data_file()

    event_handler = FileModifiedHandler()
    observer = Observer()
    observer.schedule(event_handler, data_folder, recursive=False)
    observer.start()

def start_server():
    server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server_socket.bind((SERVER_HOST, SERVER_PORT))
    server_socket.listen(1)

    while True:
        client_socket, _ = server_socket.accept()
        packet = client_socket.recv(256)
        process_packet(packet)
        client_socket.close()

if __name__ == '__main__':
    threading.Thread(target=start_server).start()
    threading.Thread(target=start_watchdog).start()
    app.run(host='0.0.0.0', port=8080)
