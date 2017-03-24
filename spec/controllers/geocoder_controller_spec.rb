require 'rails_helper'

RSpec.describe GeocoderController, type: :controller do

  describe "GET #addresses" do
    it "returns http success" do
      get :addresses
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET #positions" do
    it "returns http success" do
      get :positions
      expect(response).to have_http_status(:success)
    end
  end

end
