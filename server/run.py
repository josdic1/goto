from app import create_app

# Create the application instance
app = create_app()

if __name__ == '__main__':
    # Listen on all network interfaces (0.0.0.0)
    app.run(host='0.0.0.0', port=5555, debug=False)