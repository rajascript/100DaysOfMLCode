from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import numpy as np
import urllib
import json
import cv2


@csrf_exempt
def detect(request):

    data = {'success':False}
    received_json_data = json.loads(request.body)
    filePath = (received_json_data['path'])
    if request.method == 'POST' and filePath is not None:
        image = _grab_image(path=filePath)
        image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    return JsonResponse(data)

def _grab_image(path=None):
    if path is not None:
        image = cv2.imread(path)
    return image;



