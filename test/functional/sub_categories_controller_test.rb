require 'test_helper'

class SubCategoriesControllerTest < ActionController::TestCase
  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:sub_categories)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create sub_category" do
    assert_difference('SubCategory.count') do
      post :create, :sub_category => { }
    end

    assert_redirected_to sub_category_path(assigns(:sub_category))
  end

  test "should show sub_category" do
    get :show, :id => sub_categories(:one).to_param
    assert_response :success
  end

  test "should get edit" do
    get :edit, :id => sub_categories(:one).to_param
    assert_response :success
  end

  test "should update sub_category" do
    put :update, :id => sub_categories(:one).to_param, :sub_category => { }
    assert_redirected_to sub_category_path(assigns(:sub_category))
  end

  test "should destroy sub_category" do
    assert_difference('SubCategory.count', -1) do
      delete :destroy, :id => sub_categories(:one).to_param
    end

    assert_redirected_to sub_categories_path
  end
end
