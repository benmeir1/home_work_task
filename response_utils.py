import requests

artist_list = ['Pearl Jam',
               'Metallica',
               'Bob Dylan',
               'Queen',
               'Pink Floyd',
               'Jimi Hendrix',
               'The Who',
               'Nirvana',
               'The Beatles',
               'David Bowie',
               'Foo Fighters',
               'Led Zeppelin',
               'Red Hot Chili Peppers',
               'The Rolling Stones',
               'The Doors',
               'U2',
               'Green Day',
               'Aerosmith',
               'System of a Down',
               'The+Killers']


def get_artists_albums():
    result = {}

    for i in range(len(artist_list)):
        artist = artist_list[i]
        artist_for_search = artist.replace(" ", '+')
        if artist not in result:
            result[artist] = []

        link = "https://itunes.apple.com/search?term={}&entity=album".format(artist_for_search)
        response = requests.get(link)
        data = response.json()

        for row in range(len(data['results'])):
            result[artist].append(data['results'][row]['collectionName'])
    print(result)
    return result
