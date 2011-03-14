require 'test_helper'

class ArtistPhotosControllerTest < ActionController::TestCase
  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:artist_photos)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create artist_photo" do
    assert_difference('ArtistPhoto.count') do
      post :create, :artist_photo => { }
    end

    assert_redirected_to artist_photo_path(assigns(:artist_photo))
  end

  test "should show artist_photo" do
    get :show, :id => artist_photos(:one).to_param
    assert_response :success
  end

  test "should get edit" do
    get :edit, :id => artist_photos(:one).to_param
    assert_response :success
  end

  test "should update artist_photo" do
    put :update, :id => artist_photos(:one).to_param, :artist_photo => { }
    assert_redirected_to artist_photo_path(assigns(:artist_photo))
  end

  test "should destroy artist_photo" do
    assert_difference('ArtistPhoto.count', -1) do
      delete :destroy, :id => artist_photos(:one).to_param
    end

    assert_redirected_to artist_photos_path
  end
end
