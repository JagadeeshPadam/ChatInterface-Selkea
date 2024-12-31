# app/v1/query/service.py
import requests
from app.db.models import Session, QueryMessage

def process_user_query(query: str, session_id:str, username : str, db, kb_id: str = "master_directions_4"):
    """Processes the user's query by making an external API call."""
    url = "http://13.232.179.184:9000/knowledge/query"
    headers = {
        "Accept-Language": "en-GB,en-US;q=0.9,en;q=0.8",
        "Connection": "keep-alive",
        "Content-Type": "application/json",
    }
    payload = {
        "kb_id": kb_id,
        "query": query,
    }

    try:
        # Make API call
        response = requests.post(url, json=payload, headers=headers)
        response.raise_for_status()  # Raise an exception for HTTP errors
        data = response.json()
        print(data)
       
        
        # Process the metadata
        visited = set()
        unique_metadata = []
        for metadata_item in data['data']['retrieved_metadata']:
            filename = metadata_item.get('pdf_filename')
            if filename and filename not in visited:
                visited.add(filename)
                unique_metadata.append({
                    key.lower().replace(" ", "_"): value for key, value in metadata_item.items()
                })
            if len(visited) == 3:  # Limit to 3 unique files
                break
        
        session = Session.objects(session_id=session_id, username=username).first()
        print(session)
        # Append the new query message
        new_message = QueryMessage(query=query, content=data['data']['answer'])
        if session:
            session.messages.append(new_message)
        else:
            session=Session(session_id=session_id, username=username, messages=[new_message])
        session.save()  # Save the user to MongoDB
        # Construct final response
        return {
            "query": query,
            "response": data['data']['answer'],
            "metadata": unique_metadata,
        }
    except requests.exceptions.RequestException as e:
        raise Exception(f"Error making API call: {str(e)}")
    except KeyError as e:
        raise Exception(f"Unexpected response format: {str(e)}")
